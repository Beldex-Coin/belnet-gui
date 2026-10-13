/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Exit node swapping ("Change Node").
 *
 * Why this is unmap-then-map and not a plain re-map
 * -------------------------------------------------
 * belnet 0.9.8's `llarp.exit` handler calls Endpoint::MapExitRange, which is
 * `m_ExitMap.Insert(range, exit)` -> `m_Entries.emplace_back(...)`. It APPENDS;
 * it does not replace. Mapping a second exit over the same ::/0 range leaves
 * two live entries, and TunEndpoint::ObtainExitAddressFor feeds every matching
 * entry into a random exit-selection strategy -- so traffic would be split
 * randomly between the old and the new node.
 *
 * So we must unmap first. The daemon's `unmap` branch calls routePoker()->Down()
 * BEFORE unmapping; RoutePoker::Update() (every 100ms) only pokes routes back
 * up once HasClientExit() is true again. The two IPC calls are therefore issued
 * back to back with nothing in between.
 *
 * Why a failed addExit is verified against the daemon before rolling back
 * ----------------------------------------------------------------------
 * The renderer's IPC timeout is a CLIENT-side deadline. It firing does not mean
 * the daemon failed. Rolling back on a timeout is actively harmful: the
 * original request may still be in flight, and when it finally fails its
 * onBadResult runs `routePoker()->Down(); ep->UnmapExitRange(range)` -- which
 * tears down whatever the rollback just installed.
 *
 * BNS names never appear in the daemon's exitMap
 * ----------------------------------------------
 * When the target is a BNS name (service::NameIsValid -> the `bnsExit` branch
 * in rpc_server.cpp), the daemon runs LookupNameAsync FIRST and maps the
 * RESOLVED service address. Picking "andromeda.bdx" leaves exitMap holding
 * e.g. "hwystx4556...bdx". Comparing the daemon's exit against the string the
 * user picked can therefore never match, which made every BNS swap verify as
 * "unknown" and roll back a working connection:
 *
 *   ChangeNode => 7xwt...bdx -> andromeda.bdx
 *   exitNode set by daemon: hwystx4556...bdx   <- connected fine
 *   addExit timed out
 *   daemon reports exit "unknown"              <- compared name vs address
 *   rolling back ...
 *
 * So verification does not test for the target string. We unmapped first, and
 * we hold the swap lock, so nothing else can be touching the exit map: if the
 * daemon now reports ANY exit that is not the previous one, that mapping came
 * from our own request and the swap worked -- whatever name it went in as.
 *
 * Verification also reads for the whole budget and judges on the FINAL sample
 * rather than the first match, because a late daemon failure unmaps the range
 * again; declaring success off an early sample could leave the user with no
 * exit at all.
 */
import { appendToApplogs } from '../../../features/appLogsSlice';
import {
  markSwapStarted,
  markSwapSucceeded,
  markSwapFailed,
  onUserExitNodeSet
} from '../../../features/exitStatusSlice';
import { setGlobalError } from '../../../features/statusSlice';
import { rememberExitAlias } from '../../../features/exitAliases';
import {
  addExit,
  deleteExit,
  getSummaryStatus,
  parseSummaryStatus
} from '../../../ipc/ipcRenderer';
import { AppDispatch, store } from '../../store';

/** How long we keep asking the daemon what it is exiting through. */
const VERIFY_BUDGET_MS = 8000;
const VERIFY_INTERVAL_MS = 1500;

export type SwapOutcome =
  | { status: 'ok' }
  | { status: 'failed-rolled-back'; reason: string }
  | { status: 'failed'; reason: string };

type ApplyResult =
  | { ok: true; connectedTo: string }
  | {
      ok: false;
      reason: string;
      /**
       * True when the daemon actually answered (an error or an unexpected
       * result). False when the call produced no reply at all, which leaves
       * the daemon's state unknown to us.
       */
      replied: boolean;
    };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Turns raw transport failures into something worth showing a person. */
const humanReason = (reason: string, replied: boolean): string =>
  replied ? reason : 'the belnet daemon did not respond in time';

/**
 * Maps a single exit node and interprets the daemon's reply.
 * The success reply carries the address the daemon actually connected to,
 * which is what we keep -- for a BNS name that is the resolved address.
 */
const applyExit = async (
  node: string,
  authCode?: string
): Promise<ApplyResult> => {
  let raw: string | null = null;
  try {
    raw = await addExit(node, authCode);
  } catch (e: any) {
    // timeout or transport failure -- the daemon may still be working on it
    return {
      ok: false,
      reason: e?.message || 'exit request failed',
      replied: false
    };
  }

  if (!raw) {
    return { ok: false, reason: 'empty reply', replied: false };
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed.error) {
      return { ok: false, reason: String(parsed.error), replied: true };
    }
    const result = String(parsed.result ?? '');
    if (!result.startsWith('OK: connected to')) {
      return { ok: false, reason: result || raw, replied: true };
    }
    const resolved = /OK: connected to\s+(\S+)/.exec(result);
    return { ok: true, connectedTo: resolved ? resolved[1] : node };
  } catch (e) {
    return { ok: false, reason: raw, replied: true };
  }
};

const unmapCurrentExit = async (): Promise<void> => {
  try {
    await deleteExit();
  } catch (e: any) {
    // Not fatal: if the range was already unmapped the following map still
    // produces a correct single-entry exit map.
    console.info('swapExitNode: unmap failed, continuing', e);
  }
};

/** Asks the daemon directly which exit address it is currently using. */
const readDaemonExitNode = async (): Promise<
  { known: true; exitNode?: string } | { known: false }
> => {
  try {
    const parsed = parseSummaryStatus(await getSummaryStatus());
    return { known: true, exitNode: parsed.exitNode };
  } catch (e) {
    return { known: false };
  }
};

type Verdict =
  | { kind: 'mapped'; exitNode: string }
  | { kind: 'previous' }
  | { kind: 'none' }
  | { kind: 'unknown' };

/**
 * After a reply-less failure the daemon may still be mid-request, so sample it
 * for the whole budget and judge on the last reading.
 */
const verifyWithDaemon = async (
  previousNode: string | undefined,
  dispatch: AppDispatch
): Promise<Verdict> => {
  const deadline = Date.now() + VERIFY_BUDGET_MS;
  let last: Verdict = { kind: 'unknown' };

  for (;;) {
    const read = await readDaemonExitNode();
    if (read.known) {
      if (!read.exitNode) {
        last = { kind: 'none' };
      } else if (read.exitNode === previousNode) {
        last = { kind: 'previous' };
      } else {
        // anything else can only have come from our own map call, including a
        // BNS name the daemon resolved to an address we have never seen
        last = { kind: 'mapped', exitNode: read.exitNode };
      }
    }
    if (Date.now() >= deadline) {
      break;
    }
    await sleep(VERIFY_INTERVAL_MS);
  }

  dispatch(
    appendToApplogs(
      `ChangeNode: daemon reports ${
        last.kind === 'mapped' ? `exit ${last.exitNode}` : last.kind
      } after no reply from addExit`
    )
  );
  return last;
};

/**
 * Switches the active exit node.
 *
 * On a genuine failure the previous node is re-mapped so the user is never
 * left disconnected just because they tried to switch.
 */
export const swapExitNode = async (
  dispatch: AppDispatch,
  args: {
    targetNode: string;
    targetAuthCode?: string;
    previousNode?: string;
    previousAuthCode?: string;
  }
): Promise<SwapOutcome> => {
  const { targetNode, targetAuthCode, previousNode, previousAuthCode } = args;

  if (!targetNode) {
    return { status: 'failed', reason: 'no exit node selected' };
  }
  if (previousNode && targetNode === previousNode) {
    return { status: 'ok' };
  }
  if (store.getState().exitStatus.swapping) {
    return { status: 'failed', reason: 'a node switch is already in progress' };
  }

  dispatch(markSwapStarted({ fromNode: previousNode, targetNode }));
  dispatch(
    appendToApplogs(`ChangeNode => ${previousNode || '(none)'} -> ${targetNode}`)
  );

  /** `exitNode` is the resolved address; `alias` the name the user picked. */
  const succeed = (exitNode: string, note?: string): SwapOutcome => {
    const alias = exitNode === targetNode ? undefined : targetNode;
    dispatch(onUserExitNodeSet(targetNode));
    dispatch(markSwapSucceeded({ exitNode, alias }));
    if (alias) {
      rememberExitAlias(exitNode, alias);
    }
    dispatch(
      appendToApplogs(
        `ChangeNode <= connected to ${targetNode}${
          alias ? ` (${exitNode})` : ''
        }${note ? ` [${note}]` : ''}`
      )
    );
    if (store.getState().status.globalError === 'error-add-exit') {
      dispatch(setGlobalError(undefined));
    }
    return { status: 'ok' };
  };

  // --- the narrow window: unmap, then immediately map. Nothing in between. ---
  await unmapCurrentExit();
  const applied = await applyExit(targetNode, targetAuthCode);
  // --------------------------------------------------------------------------

  if (applied.ok) {
    return succeed(applied.connectedTo);
  }

  dispatch(appendToApplogs(`ChangeNode <= addExit failed: ${applied.reason}`));

  // No reply means we do not know what the daemon did. Ask it before touching
  // anything -- rolling back a swap that worked is worse than waiting.
  if (!applied.replied) {
    dispatch(
      appendToApplogs(
        'ChangeNode: no reply from the daemon, verifying actual exit state'
      )
    );
    const verdict = await verifyWithDaemon(previousNode, dispatch);

    if (verdict.kind === 'mapped') {
      // the switch worked; the reply was simply lost
      return succeed(verdict.exitNode, 'confirmed by daemon status');
    }

    if (verdict.kind === 'previous') {
      // the map never took and the old mapping is still live: nothing to roll
      // back, and re-mapping would needlessly disturb a working connection.
      const reason = humanReason(applied.reason, applied.replied);
      dispatch(markSwapFailed({ error: reason, rolledBackTo: previousNode }));
      dispatch(
        appendToApplogs(`ChangeNode <= unchanged, still on ${previousNode}`)
      );
      return { status: 'failed-rolled-back', reason };
    }
    // 'none' or 'unknown' -> fall through and restore the previous node
  }

  // --- rollback ---
  // Safe here: either the daemon told us it failed (it has already unmapped the
  // range itself), or we verified it is not on a new mapping.
  const reason = humanReason(applied.reason, applied.replied);

  if (previousNode) {
    dispatch(appendToApplogs(`ChangeNode => rolling back to ${previousNode}`));
    const rolledBack = await applyExit(previousNode, previousAuthCode);

    const rollbackSucceeded = (address: string) => {
      dispatch(onUserExitNodeSet(previousNode));
      dispatch(markSwapFailed({ error: reason, rolledBackTo: address }));
      dispatch(appendToApplogs(`ChangeNode <= rolled back to ${previousNode}`));
      return { status: 'failed-rolled-back' as const, reason };
    };

    if (rolledBack.ok) {
      return rollbackSucceeded(rolledBack.connectedTo);
    }

    // Rollback got no reply either -- it may still have worked.
    if (!rolledBack.replied) {
      const verdict = await verifyWithDaemon(undefined, dispatch);
      if (verdict.kind === 'mapped') {
        return rollbackSucceeded(verdict.exitNode);
      }
    }

    dispatch(
      appendToApplogs(
        `ChangeNode <= rollback to ${previousNode} failed: ${rolledBack.reason}`
      )
    );
  }

  dispatch(markSwapFailed({ error: reason }));
  if (store.getState().status.globalError === undefined) {
    dispatch(setGlobalError('error-add-exit'));
  }
  return { status: 'failed', reason };
};

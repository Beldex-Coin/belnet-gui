/**
 * BNS name <-> belnet address bookkeeping for the exit node.
 *
 * When the user connects to a BNS exit (e.g. "andromeda.bdx") the daemon
 * resolves it and only ever reports the resolved service address in
 * `exitMap`. The UI wants to keep showing the name the user picked, so we
 * remember which name produced which address.
 *
 * The mapping is also persisted (address -> name) so the name still shows
 * after the GUI restarts while the daemon keeps the same exit mapped.
 */

const STORAGE_KEY = 'belnet-gui.exitAliases';
const MAX_REMEMBERED = 50;

// A raw belnet service address: 52 base32 characters + ".bdx".
const BELNET_ADDRESS_RE = /^[a-z0-9]{52}\.bdx$/i;

export const isBelnetAddress = (value?: string): boolean =>
  Boolean(value) && BELNET_ADDRESS_RE.test((value as string).trim());

/** True for a human readable BNS name such as "andromeda.bdx". */
export const isBnsName = (value?: string): boolean =>
  Boolean(value) &&
  /\.bdx$/i.test((value as string).trim()) &&
  !isBelnetAddress(value);

const readAll = (): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
};

const writeAll = (aliases: Record<string, string>): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(aliases));
  } catch (e) {
    // storage unavailable: the name still shows for this session
  }
};

/** Remembers that `alias` (a BNS name) resolved to `address`. */
export const rememberExitAlias = (address: string, alias: string): void => {
  if (!address || !alias || address === alias) {
    return;
  }
  const aliases = readAll();
  delete aliases[address];
  aliases[address] = alias;
  // keep only the most recent entries (insertion order)
  const keys = Object.keys(aliases);
  for (const key of keys.slice(0, Math.max(0, keys.length - MAX_REMEMBERED))) {
    delete aliases[key];
  }
  writeAll(aliases);
};

/** Returns the BNS name we last saw resolve to `address`, if any. */
export const lookupExitAlias = (address?: string): string | undefined =>
  address ? readAll()[address] : undefined;

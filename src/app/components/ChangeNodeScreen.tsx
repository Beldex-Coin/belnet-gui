/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import { useAppDispatch } from '../hooks';
import { closeChangeNodeScreen } from '../../features/uiStatusSlice';
import {
  clearSwapError,
  onUserExitNodeSet,
  selectActiveExitAlias,
  selectActiveExitNode,
  selectAuthCodeFromUser,
  selectIsSwappingExitNode,
  selectSwapError,
  selectSwapRolledBack,
  selectSwapTargetNode
} from '../../features/exitStatusSlice';
import { swapExitNode } from './PowerButton/ExitNodeSwapActions';
import CountryFlags from './CountryImageSrc';
import {
  ExitNode,
  ExitNodeGroup,
  latencyColor,
  loadExitNodes,
  invalidateExitNodeCache,
  sortNodesByLatency
} from './exitNodeList';

/* The title bar stays visible and usable (drag, minimise, close) above the
   overlay, so this starts just below it rather than at the very top. */
const TITLE_BAR_OFFSET_PX = 46;

const Screen = styled.div`
  position: fixed;
  top: ${TITLE_BAR_OFFSET_PX}px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.modalBg};
  animation: changeNodeSlideUp 180ms ease-out;

  @keyframes changeNodeSlideUp {
    from {
      transform: translateY(14px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px 12px;
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.activePathColor};
    outline-offset: 1px;
  }
`;

const HeaderTitle = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.appLogContentColor};
`;

const Banner = styled.div<{ tone: 'info' | 'error' }>`
  margin: 0 20px 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 11.5px;
  line-height: 1.5;
  flex-shrink: 0;
  color: ${(props) =>
    props.tone === 'error' ? '#e74c3c' : props.theme.appLogContentColor};
  background: ${(props) => props.theme.inputBackground};
  border-left: 3px solid
    ${(props) =>
      props.tone === 'error' ? '#e74c3c' : props.theme.activePathColor};
`;

const BannerNote = styled.div`
  color: ${(props) => props.theme.streamLabelColor};
  font-size: 10.5px;
  margin-top: 2px;
`;

const ListScroll = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 20px 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollBar};
    border-radius: 3px;
  }
`;

const GroupLabel = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${(props) => props.theme.streamLabelColor};
  padding: 14px 2px 7px;
`;

const NodeRow = styled.div<{ isCurrent: boolean; isBusy: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 8px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  background: ${(props) => props.theme.inputBackground};
  border: 1px solid
    ${(props) => (props.isCurrent ? props.theme.tabSelected : 'transparent')};
  cursor: ${(props) =>
    props.isCurrent ? 'default' : props.isBusy ? 'progress' : 'pointer'};
  opacity: ${(props) => (props.isBusy && !props.isCurrent ? 0.6 : 1)};
  transition: border-color 120ms ease, background 120ms ease;

  &:hover {
    border-color: ${(props) =>
      props.isCurrent
        ? props.theme.tabSelected
        : props.isBusy
        ? 'transparent'
        : props.theme.activePathColor};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.activePathColor};
    outline-offset: 1px;
  }
`;

const NodeText = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const NodeName = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: ${(props) => props.theme.appLogContentColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NodeCountry = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 9px;
  color: ${(props) => props.theme.streamLabelColor};
  margin-bottom: 2px;
`;

const NodeLatency = styled.span<{ ms: number }>`
  font-family: 'Poppins', sans-serif;
  font-size: 9.5px;
  font-weight: 600;
  color: ${(props) => latencyColor(props.ms)};
  min-width: 42px;
  text-align: right;
  flex-shrink: 0;
`;

const ConnectedPill = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.theme.tabSelected};
  border: 1px solid ${(props) => props.theme.tabSelected};
  border-radius: 10px;
  padding: 2px 7px;
  flex-shrink: 0;
`;

const RowSpinner = styled.span`
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.exitNodeIconColor};
  border-top-color: ${(props) => props.theme.activePathColor};
  animation: rowSpin 700ms linear infinite;

  @keyframes rowSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CentredNote = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: ${(props) => props.theme.streamLabelColor};
  text-align: center;
  padding: 32px 10px;
`;

const RetryLink = styled.button`
  display: block;
  margin: 10px auto 0;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.activePathColor};
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
`;

const BackArrow = ({ color }: { color: string }): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M10 3L5 8l5 5"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChangeNodeScreen = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const activeNode = useSelector(selectActiveExitNode);
  const activeAlias = useSelector(selectActiveExitAlias);
  const isSwapping = useSelector(selectIsSwappingExitNode);
  const swapTarget = useSelector(selectSwapTargetNode);
  const swapError = useSelector(selectSwapError);
  const swapRolledBack = useSelector(selectSwapRolledBack);
  const authCodeFromUser = useSelector(selectAuthCodeFromUser);

  const [groups, setGroups] = React.useState<Array<ExitNodeGroup>>([]);
  const [latencies, setLatencies] = React.useState<
    Record<string, number | null>
  >({});
  const [loading, setLoading] = React.useState(true);
  const [loadFailed, setLoadFailed] = React.useState(false);

  const isMounted = React.useRef(true);
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = React.useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setLoadFailed(false);
    if (forceRefresh) {
      invalidateExitNodeCache();
    }
    try {
      const { list, latencies: measured } = await loadExitNodes();
      if (!isMounted.current) {
        return;
      }
      setGroups(Array.isArray(list) ? list : []);
      setLatencies(measured || {});
    } catch (e) {
      console.info('ChangeNodeScreen: could not load the exit node list', e);
      if (isMounted.current) {
        setLoadFailed(true);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const close = () => {
    dispatch(clearSwapError());
    dispatch(closeChangeNodeScreen());
  };

  // A BNS name the user picked resolves to a different address in the daemon,
  // so a row is "current" if it matches either.
  const isActiveRow = (name?: string) =>
    Boolean(name) && (name === activeNode || name === activeAlias);

  const onSelectNode = async (node: ExitNode) => {
    if (!node?.name || isSwapping) {
      return;
    }
    if (isActiveRow(node.name)) {
      return;
    }

    // Not connected to anything yet: just pick the node so the power button
    // uses it. Nothing to swap.
    if (!activeNode) {
      dispatch(onUserExitNodeSet(node.name));
      close();
      return;
    }

    const outcome = await swapExitNode(dispatch, {
      targetNode: node.name,
      previousNode: activeNode,
      previousAuthCode: authCodeFromUser
    });

    if (outcome.status === 'ok' && isMounted.current) {
      dispatch(closeChangeNodeScreen());
    }
    // on failure the screen stays open and the banner explains what happened
  };

  const renderBanner = () => {
    if (isSwapping) {
      return (
        <Banner tone="info">
          {`Switching to ${swapTarget || 'the selected node'}…`}
          <BannerNote>
            Re-mapping the exit. This takes a few seconds while the new path is
            built.
          </BannerNote>
        </Banner>
      );
    }
    if (swapError) {
      return (
        <Banner tone="error">
          {`Could not switch: ${swapError}`}
          <BannerNote>
            {swapRolledBack
              ? `Kept you on ${activeAlias || activeNode}. Pick another node to try again.`
              : 'Not connected to an exit node. Pick a node to try again.'}
          </BannerNote>
        </Banner>
      );
    }
    if (!activeNode) {
      return (
        <Banner tone="info">
          Not connected.
          <BannerNote>
            Choosing a node here selects it — use the power button to connect.
          </BannerNote>
        </Banner>
      );
    }
    return null;
  };

  const hasNodes = groups.some((g) => Array.isArray(g?.node) && g.node.length);

  return (
    <Screen role="dialog" aria-label="Change exit node">
      <Header>
        <BackButton type="button" onClick={close} aria-label="Back">
          <BackArrow color={theme.appLogContentColor} />
        </BackButton>
        <HeaderTitle>Change Node</HeaderTitle>
      </Header>

      {renderBanner()}

      <ListScroll>
        {loading && <CentredNote>Loading exit nodes…</CentredNote>}

        {!loading && loadFailed && (
          <CentredNote>
            Could not load the exit node list.
            <RetryLink type="button" onClick={() => void load(true)}>
              Try again
            </RetryLink>
          </CentredNote>
        )}

        {!loading && !loadFailed && !hasNodes && (
          <CentredNote>No exit nodes available.</CentredNote>
        )}

        {!loading &&
          !loadFailed &&
          groups.map((group) => (
            <div key={group.type}>
              <GroupLabel>{`${group.type} · ${
                group.node?.length || 0
              } nodes`}</GroupLabel>
              {sortNodesByLatency(group.node || [], latencies).map((node) => {
                const isCurrent = isActiveRow(node.name);
                const isTarget = isSwapping && node.name === swapTarget;
                const ms = latencies[node.name];
                return (
                  <NodeRow
                    key={node.name}
                    isCurrent={isCurrent}
                    isBusy={isSwapping}
                    role="button"
                    tabIndex={isCurrent || isSwapping ? -1 : 0}
                    aria-disabled={isCurrent || isSwapping}
                    onClick={() => void onSelectNode(node)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        void onSelectNode(node);
                      }
                    }}
                  >
                    <CountryFlags
                      style={{}}
                      keyItem={node.name}
                      countryName={node.country?.toLowerCase()}
                    />
                    <NodeText>
                      <NodeCountry>{node.country}</NodeCountry>
                      <NodeName>{node.name}</NodeName>
                    </NodeText>
                    {ms != null && <NodeLatency ms={ms}>{`${ms}ms`}</NodeLatency>}
                    {isTarget && <RowSpinner />}
                    {isCurrent && !isSwapping && (
                      <ConnectedPill>Connected</ConnectedPill>
                    )}
                  </NodeRow>
                );
              })}
            </div>
          ))}
      </ListScroll>
    </Screen>
  );
};

import React, { useEffect, useState } from 'react';
import { Flex, Stack, Input, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { useOutsideClick } from '@chakra-ui/react'
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitNodeDisplayName,
  selectExitStatus
} from '../../features/exitStatusSlice';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import Select, { components, DropdownIndicatorProps, IndicatorSeparatorProps } from 'react-select';
import { useAppDispatch } from '../hooks';
import {
  flattenNodes,
  getCachedLatencies,
  getCachedList,
  isCacheFresh,
  latencyColor,
  loadExitNodes as loadExitNodeGroups,
  sortNodesByLatency
} from './exitNodeList';
import CountryFlags, { getCountryFlag } from './CountryImageSrc';
import { selectIpAddress } from '../../features/ipAddressSlice';
import { appendToApplogs } from '../../features/appLogsSlice';
import { store } from '../store';
import { pickNearestExitNode } from './nearestExitNode';
import ClearWhite from "../../../images/ExitNodeClear_white.svg";
import ClearDark from "../../../images/ExitNodeClear_dark.svg";
// let defaultExitUse;
const NodeAccordion = styled(Accordion)`
overflow: hidden;
    position: absolute;
    background-color: ${(props) => props.theme.inputBackground};
    bottom: ${(props) => props.className === 'newValuePresent' ? '45px' : '72px'};
    max-height: 520px;
    z-index: 10;
    border-radius: 8px;
    width: 368px;`;

const NodeAccordionItem = styled(AccordionItem)`
  min-height: 62px;
  padding: 14px 0 0;
 border-bottom: ${(props) => props.theme.nodeSeparator};
 border-radius: ${(props) => props.className === 'nodeItem-0' ? '8px 8px 0 0' : '0 0 8px 8px'};
`;

const NodeAccordionButton = styled(AccordionButton)`
  background: none;
    outline: none;
    border: 0;
    padding: 0 10px 0 22px;
`;

const NodeAccordionIcon = styled(AccordionIcon)`
 font-size: 25px;
  color: ${(props) => props.className === 'nodeIcon-0' ? props.theme.tabSelected : props.theme.activePathColor} !important;
`;

const NodeArrLabel = styled.div`
  color: ${(props) => props.className === 'node-0' ? props.theme.tabSelected : props.theme.activePathColor};
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`;

const NodeArrLength = styled.div`
  font-size: 10px;
  color: ${(props) => props.theme.streamLabelColor};
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
`;

const NodeName = styled.p`
  width: 257px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 10px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => props.theme.appLogContentColor};
  padding-top: 3px;
`;

const NodeCountry = styled.p`
  color: ${(props) => props.theme.streamLabelColor};
  font-size: 8px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
`;

const NodeDetail = styled.div`
  display: flex;
  height: 38px;
  padding: 7px 10px;
  justify-content: space-around;
  align-items: center;
  border-bottom: ${(props) => props.theme.nodeSeparator};
  `;

const NodeAccordionPanel = styled(AccordionPanel)`
    max-height: 372px;
    overflow: auto;
    padding: 0;
`;

const NodeCircle = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-left: 7px;
  background-color: ${(props) => props.theme.tabSelected};
`;
const NewExitNode = styled.p`
text-align: center;
    font-size: 14px;
    padding: 5px;
    color: ${(props) => props.theme.activePathColor};
`;

// --- exit node card: flag badge, country above name/address, chevron ---

const ExitNodeCard = styled.div`
  display: flex;
  align-items: center;
  width: 370px;
  min-height: 50px;
  padding: 6px 10px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.inputBackground};
  font-family: 'Poppins', sans-serif;
`;

const FlagBadge = styled.div<{ isDark: boolean }>`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: ${(props) =>
    props.isDark ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.05)'};
  & img {
    margin-top: 0 !important;
  }
`;

const CardText = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

const CardCountry = styled.div`
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  color: ${(props) => props.theme.streamLabelColor};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
`;

const CardName = styled.div`
  font-size: 13px;
  font-weight: 500;
  line-height: 17px;
  color: ${(props) => props.theme.appLogContentColor};
  /* long belnet addresses wrap onto a second line, then ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
`;

const CardInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.appLogContentColor};
  &::placeholder {
    color: ${(props) => props.theme.labelValueColor};
    font-weight: 400;
  }
`;

const ClearButton = styled.button`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: none;
  border: none;
  cursor: pointer;
`;

const ChevronButton = styled.button<{ isDark: boolean }>`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 6px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: ${(props) =>
    props.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
`;

const ChevronIcon = ({ color, open }: { color: string; open: boolean }) => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 12 12'
    aria-hidden='true'
    className='exitNode'
    style={{
      transform: open ? 'rotate(-90deg)' : 'none',
      transition: 'transform 0.15s',
      pointerEvents: 'none'
    }}
  >
    <path
      d='M4.5 2.5L8 6l-3.5 3.5'
      fill='none'
      stroke={color}
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

/** Shown in the badge when the exit node's country (or its flag) is unknown. */
const GlobeIcon = ({ color }: { color: string }) => (
  <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true' style={{ pointerEvents: 'none' }}>
    <g fill='none' stroke={color} strokeWidth='1.5'>
      <circle cx='12' cy='12' r='9' />
      <path d='M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z' />
    </g>
  </svg>
);

const InputLabel = styled.div`
color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  text-align: start;
  user-select: none;
  padding: 7px 0;
  letter-spacing: 0.75px;
`;


const NodeLatency = styled.span<{ ms: number }>`
  font-size: 9px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => latencyColor(props.ms)};
  min-width: 42px;
  text-align: right;
`;

const FetchErrorNote = styled.div`
  font-size: 11px;
  font-family: 'Poppins', sans-serif;
  color: #e74c3c;
  padding: 4px 0;
  cursor: pointer;
  user-select: none;
`;


export const ExitPanel = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuList, setMenuList] = useState<Array<any>>([]);
  const [latencyByName, setLatencyByName] = useState<
    Record<string, number | null>
  >({});
  const [listError, setListError] = useState(false);
  const [selectedNode, setNode] = useState<any>({});
  // when the user picks a node manually, latency results must not override it
  const userChoseNodeRef = React.useRef(false);

  const exitStatus = useSelector(selectExitStatus);
  const dispatch = useAppDispatch();
  const ref = React.useRef();
  const exitnodeInputRef = React.useRef();
  const theme = useTheme();
  const themeSelected = useSelector(selectedTheme);
  const disableInputEdits =
    exitStatus.exitLoading || Boolean(exitStatus.exitNodeFromDaemon);
  // For a BNS exit the daemon only reports the resolved address: show the BNS
  // name the user connected with instead (falls back to the address).
  const exitNodeDisplayName = useSelector(selectExitNodeDisplayName);
  const { vpnCountry, vpnIpLoading, deviceLocation } =
    useSelector(selectIpAddress);
  const exitToUse = disableInputEdits
    ? exitNodeDisplayName
    : exitStatus.exitNodeFromUser;
  const [newValue, setNewValue] = React.useState<string>("");

  useOutsideClick({
    ref: ref,
    handler: (e) => {
      if (e && e?.target && e?.target?.className) {
        const DOMClassList = e?.target?.className?.split(' ')
        const isExitNode = DOMClassList && DOMClassList?.find((item: any) => item === 'exitNode');
        if (isExitNode && isExitNode === 'exitNode') {
          return
        } else {
          setIsMenuOpen(false)
        }
      }

    },
  })
  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode

  // const exitDaemon = exitStatus.exitNodeFromDaemon;
  // defaultExitUse = exitToUse;

  // How the current node was picked automatically. Picking by distance wins
  // over the fallbacks, so if the device location arrives after the list we
  // re-pick once by distance.
  const autoPickRef = React.useRef<'none' | 'nearest' | 'fallback'>('none');

  /**
   * Automatic exit node choice, unless the user already picked one:
   *  1. nearest node to the device (Haversine on latitude/longitude),
   *     random among equally near nodes
   *  2. otherwise the lowest measured latency
   *  3. otherwise a random node
   */
  const autoSelectNode = (
    list: Array<any>,
    latencies: Record<string, number | null>
  ) => {
    if (userChoseNodeRef.current || !Array.isArray(list) || list.length === 0) {
      return;
    }
    const allNodes = flattenNodes(list);
    const deviceLocation = store.getState().ipAddress.deviceLocation;

    if (deviceLocation) {
      const nearest = pickNearestExitNode(allNodes, deviceLocation);
      if (nearest) {
        autoPickRef.current = 'nearest';
        setNode(nearest.node);
        dispatch(onUserExitNodeSet(nearest.node.name));
        dispatch(
          appendToApplogs(
            `Nearest exit node: ${nearest.node.name} (${Math.round(
              nearest.distanceKm
            )} km${
              nearest.tiedCount > 1
                ? `, random pick among ${nearest.tiedCount} equally near`
                : ''
            })`
          )
        );
        return;
      }
    }

    if (autoPickRef.current === 'fallback') {
      // already picked a fallback node; don't reshuffle it
      return;
    }
    autoPickRef.current = 'fallback';
    const measured = allNodes.filter(
      (n: any) => n?.name && latencies[n.name] != null
    );
    if (measured.length > 0) {
      const fastest = measured.reduce((x: any, y: any) =>
        (latencies[x.name] as number) <= (latencies[y.name] as number) ? x : y
      );
      setNode(fastest);
      dispatch(onUserExitNodeSet(fastest.name));
      return;
    }
    getRandomExitNode(list);
  };

  const loadExitNodes = async () => {
    setListError(false);

    // Served from the shared module cache when fresh, so the Main tab panel
    // and the Change Node screen never fetch or probe twice.
    if (isCacheFresh()) {
      const cachedList = getCachedList();
      if (cachedList) {
        const cached = getCachedLatencies();
        setMenuList(cachedList);
        setLatencyByName(cached);
        autoSelectNode(cachedList, cached);
        return;
      }
    }

    try {
      const { list, latencies } = await loadExitNodeGroups();
      setMenuList(list);
      setLatencyByName(latencies);
      autoSelectNode(list, latencies);
    } catch (e) {
      console.info('could not load the exit node list', e);
      setListError(true);
    }
  };

  // The device location usually arrives a few seconds after the list (it is
  // looked up once the app knows it is disconnected): pick by distance then.
  useEffect(() => {
    if (deviceLocation && autoPickRef.current !== 'nearest' && menuList.length) {
      autoSelectNode(menuList, latencyByName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceLocation?.latitude, deviceLocation?.longitude, menuList]);

  useEffect(() => {
    void loadExitNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(newValue === '') {
      setTimeout(()=>{exitnodeInputRef.current?.focus();}, 500)
      
    }
  }, [newValue])
  const openNodeList = () => {
    setIsMenuOpen((prev) => !prev);
  }

  const onInputBlur = (e: any) => {
    const html = e.target.value;
    userChoseNodeRef.current = true;
    const nodeList = {
      country: "",
      icon: "",
      id: 0,
      isActive: "true",
      name: html
    }
    setNode(nodeList)
    // openNodeList();
    setNewValue(html);
    dispatch(onUserExitNodeSet(nodeList.name))
  }

  const setNewExitNode = () => {
    if (newValue) {
      const nodeList = {
        country: "",
        icon: "",
        id: 0,
        isActive: "true",
        name: newValue
      }
      setNode(nodeList)
      openNodeList();
      setNewValue("");
      dispatch(onUserExitNodeSet(nodeList.name))
    }
  }

  const handleChange = (nodeList: any) => {
    if (nodeList && nodeList.name) {
      userChoseNodeRef.current = true;
      setNode(nodeList)
      openNodeList();
      dispatch(onUserExitNodeSet(nodeList.name))
    }
  }

  const clearNodeValue = (e: any) => {
    userChoseNodeRef.current = true;
    dispatch(onUserExitNodeSet(''))
    setNode({})
    setNewValue('');
  }

  const getRandomExitNode = (list: any) => {
    const allNodes: any = [];
    list.forEach((item: any) => {
      const node = item?.node;
      allNodes.push(...node);
    });
    const maxMenuLenIndex = allNodes.length - 1;
    const min = 0;
    const randomExitNodeIndex = Math.floor(Math.random() * (maxMenuLenIndex - min + 1) + min);
    const randomExitNode: any = allNodes[randomExitNodeIndex]
    dispatch(onUserExitNodeSet(randomExitNode?.name))
    setNode(randomExitNode)
    return randomExitNode
  }

  // Listed nodes carry their country in the exit node list. A custom node
  // (typed in by the user) has none, so once connected we use the country of
  // the VPN IP, which is the exit node's address on the internet.
  const isConnected = disableInputEdits && !exitStatus.exitLoading;
  const listedConnectedNode = flattenNodes(menuList).find(
    (n: any) => n?.name && n.name === exitToUse
  );
  const isCustomConnectedNode = isConnected && !listedConnectedNode?.country;

  // what the exit node card shows
  const cardName: string = disableInputEdits
    ? (!exitStatus.exitLoading && exitToUse) || ''
    : selectedNode?.name || exitToUse || newValue || '';
  const cardCountry: string | undefined = disableInputEdits
    ? isConnected
      ? listedConnectedNode?.country ||
        (isCustomConnectedNode ? vpnCountry : undefined)
      : undefined
    : selectedNode?.country || undefined;
  const cardCountryLine =
    cardCountry ||
    (isCustomConnectedNode && vpnIpLoading ? 'Locating exit node…' : undefined);
  const cardFlag = Boolean(cardCountry && getCountryFlag(cardCountry));


  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
    >
      <Stack direction="row" alignSelf="center" width="100%" height="100%">
        <Flex flexDirection="column" flexGrow={1}>
          <InputLabel>Exit Node</InputLabel>
          {listError && (
            <FetchErrorNote onClick={() => void loadExitNodes()}>
              Could not load the exit node list. Tap to retry.
            </FetchErrorNote>
          )}
          {/* <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              fontSize='1.2em'
              children='$'
            />
            <Input
              placeholder=''
              className='exitNode'
              onFocus={openNodeList}
              // onBlur={closeNodeList}
              defaultValue={selectedNode?.name}
            // value={exitToUse || ''}
            />
            <InputRightElement children={<div />} />
          </InputGroup> */}
          <ExitNodeCard className='exitNode'>
            <FlagBadge className='exitNode' isDark={themeSelected !== 'light'}>
              {cardFlag ? (
                <CountryFlags
                  style={{ paddingRight: 0, height: '14px' }}
                  keyItem={cardName}
                  countryName={cardCountry?.toLowerCase()}
                />
              ) : (
                <GlobeIcon color={theme.streamLabelColor} />
              )}
            </FlagBadge>
            <CardText className='exitNode' onClick={!disableInputEdits && cardName ? openNodeList : undefined}>
              {cardCountryLine && (
                <CardCountry className='exitNode' title={cardCountryLine}>
                  {cardCountryLine}
                </CardCountry>
              )}
              {cardName ? (
                <CardName className='exitNode' title={cardName}>
                  {cardName}
                </CardName>
              ) : disableInputEdits ? (
                <CardCountry className='exitNode'>Connecting…</CardCountry>
              ) : (
                <CardInput
                  ref={exitnodeInputRef}
                  onBlur={onInputBlur}
                  placeholder='Enter an exit node'
                  spellCheck={false}
                  maxLength={56}
                />
              )}
            </CardText>
            {!disableInputEdits && cardName && (
              <ClearButton
                type='button'
                className='exitNode'
                onClick={clearNodeValue}
                aria-label='Clear exit node'
              >
                {themeSelected === 'light' ? <img src={ClearWhite} alt='' /> : <img src={ClearDark} alt='' />}
              </ClearButton>
            )}
            {/* only while disconnected: opens the node list. Hidden once
                connecting/connected, when the exit node can't be edited. */}
            {!disableInputEdits && (
              <ChevronButton
                type='button'
                className='exitNode'
                isDark={themeSelected !== 'light'}
                aria-label='Choose exit node'
                onClick={openNodeList}
              >
                <ChevronIcon color={theme.appLogContentColor} open={isMenuOpen} />
              </ChevronButton>
            )}
          </ExitNodeCard>
          {isMenuOpen && menuList && menuList.length > 0 &&
            <NodeAccordion className={newValue ? 'newValuePresent' : 'noNewValue'} allowToggle ref={ref}>
              {menuList.map((nodeArr: any, index: number) =>
                <NodeAccordionItem key={nodeArr.type} className={`nodeItem-${index}`}>
                  <NodeAccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      <NodeArrLabel className={`node-${index}`}>{nodeArr.type}</NodeArrLabel>
                      <NodeArrLength>{`${nodeArr.node.length} Nodes`}</NodeArrLength>
                    </Box>
                    <NodeAccordionIcon className={`nodeIcon-${index}`} />
                  </NodeAccordionButton>
                  <NodeAccordionPanel >
                    {sortNodesByLatency(nodeArr.node, latencyByName).map((nodeList: any) =>
                      <NodeDetail key={nodeList.name} onClick={() => handleChange(nodeList)} style={selectedNode?.name === nodeList.name ? { background: '#1994FC', borderRadius: '8px' } : {}}>
                        <CountryFlags style={{}} keyItem={nodeList.name} countryName={nodeList.country?.toLowerCase()} />
                        <div>
                          <NodeCountry>{nodeList.country}</NodeCountry>
                          <NodeName>{nodeList.name}</NodeName>
                        </div>
                        {latencyByName[nodeList.name] != null && (
                          <NodeLatency ms={latencyByName[nodeList.name] as number}>
                            {`${latencyByName[nodeList.name]}ms`}
                          </NodeLatency>
                        )}
                        <NodeCircle />
                      </NodeDetail>
                    )}
                  </NodeAccordionPanel>
                </NodeAccordionItem>
              )}
              {/* {newValue && <NewExitNode onClick={setNewExitNode}>Create New: {newValue}</NewExitNode>} */}
            </NodeAccordion>
          }
        </Flex>
      </Stack>
    </Flex>
  );
};

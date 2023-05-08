import React, { useEffect, useState } from 'react';
import { Flex, Stack, Input, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { useOutsideClick } from '@chakra-ui/react'
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import Select, { components, DropdownIndicatorProps, IndicatorSeparatorProps } from 'react-select';
import { useAppDispatch } from '../hooks';
import CountryFlags from './CountryImageSrc';
import DropDownWhite from '../../../images/drop_down_white.svg';
import DropDownDark from '../../../images/drop_down_dark.svg';
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
  padding-bottom: 3px;
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

const ExitNodeValue = styled.div`
display: flex;
background-color: ${(props) => props.theme.inputBackground};
color: ${(props) => props.theme.activePathColor};
outline-color: transparent;
font-family: 'Poppins', sans-serif;
height: 33px;
width: 370px;
font-weight: 400;
border-radius: 6px;
border: none;
font-size: 12px;
padding: 10px 12px;
outline: none;
`;

const ExitInputGroup = styled(InputGroup)`
  height: 33px;
`;

const ExitInputLeftElement = styled(InputLeftElement)`
  height: 33px;
  padding-left: 10px;
`;

const ExitInput = styled(Input)`
  background-color: ${(props) => props.theme.inputBackground};
  color: ${(props) => props.theme.activePathColor};
  outline-color: transparent;
  font-family: 'Poppins', sans-serif;
  height: 33px;
  font-weight: 400;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  padding: 10px 12px 10px 35px;
  outline: none;
  width: 100%;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
`;

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


const promiseOptions = () =>
  new Promise<[]>((resolve) => {
    fetch("https://deb.beldex.io/Beldex-projects/Belnet/exitnodelist.json")
      .then(response => response.json())
      .then(data => {
        // const exitNodeArr = data.map((item: any) => {
        //   return {
        //     value: item.name,
        //     label: item.name
        //   }
        // })
        resolve(data)
      })
  });

const ArrowStyle = {
  transform: 'rotate(-180deg)',
  position: 'relative',
  top: '3px'
}

export const ExitPanel = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [selectedNode, setNode] = useState<any>({});

  const exitStatus = useSelector(selectExitStatus);
  const dispatch = useAppDispatch();
  const ref = React.useRef()
  const theme = useTheme();
  const themeSelected = useSelector(selectedTheme);
  const disableInputEdits =
    exitStatus.exitLoading || Boolean(exitStatus.exitNodeFromDaemon);
  const exitToUse = disableInputEdits
    ? exitStatus.exitNodeFromDaemon
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

  useEffect(() => {
    promiseOptions().then((list: any) => {
      setMenuList(list);
      getRandomExitNode(list);
    })
  }, [])

  const openNodeList = () => {
    setIsMenuOpen((prev) => !prev);
  }

  const changeExitNode = (e: any) => {
    const html = e.target.innerText;
    setIsMenuOpen(false)
    setNewValue(html);
  }
  const closeNodeList = () => {
    setIsMenuOpen(false);
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
      setNode(nodeList)
      openNodeList();
      dispatch(onUserExitNodeSet(nodeList.name))
    }
  }

  const clearNodeValue = (e: any) => {
    dispatch(onUserExitNodeSet(''))
    setNode({})
    setNewValue("");
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

  const arrowMenuStyle = isMenuOpen ? { ...ArrowStyle, padding: '0 5px' } : { padding: '0 5px' };
  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
    >
      <Stack direction="row" alignSelf="center" width="100%" height="100%">
        <Flex flexDirection="column" flexGrow={1}>
          <InputLabel>Exit Node</InputLabel>
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
          {disableInputEdits ? <ExitInputGroup>
            <ExitInputLeftElement
              pointerEvents='none'
              children={
                (!exitStatus.exitLoading) && <CountryFlags style={{ marginTop: '3px' }} keyItem={selectedNode?.name} countryName={selectedNode?.country?.toLowerCase()} />
              }
            />
            <ExitInput
              disabled={disableInputEdits}
              onChange={(e: any) =>
                dispatch(onUserExitNodeSet(e?.currentTarget?.value))
              }
              onPaste={(e: any) =>
                dispatch(onUserExitNodeSet(e?.currentTarget?.value))
              }
              size="sm"
              variant="flushed"
              marginBottom={2}
              spellCheck={false}
              noOfLines={1}
              value={exitToUse || ''}
            />  </ExitInputGroup>
            :

            <ExitNodeValue className='exitNode' >
              {selectedNode?.name && <CountryFlags onClick={openNodeList} style={{ marginTop: '3px' }} keyItem={selectedNode?.name} countryName={selectedNode?.country?.toLowerCase()} />}
              <p onClick={openNodeList} contentEditable={true} onInput={changeExitNode} className='exitNode' style={{ textOverflow: 'ellipsis', maxWidth: '324px', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectedNode?.name || exitToUse}</p>
              <div style={{display: 'flex', marginLeft: 'auto'}}>
                 <div className='exitNode' onClick={clearNodeValue} style={{ padding: '0 5px', zIndex: 100 }}>
                  {themeSelected === 'light' ? <img src={ClearWhite} alt="white" /> : <img src={ClearDark} alt="dark" />}
                </div>
               <span style={{ margin: '0 5px', border: `solid 0.5px ${theme.exitNodeIconColor}` }}></span>
                <div onClick={openNodeList} className='exitNode' style={arrowMenuStyle}>
                  {themeSelected === 'light' ? <img src={DropDownWhite} alt="white" /> : <img src={DropDownDark} alt="dark" />}
                </div>
              </div>
            </ExitNodeValue>
          }
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
                    {nodeArr.node.map((nodeList: any) =>
                      <NodeDetail key={nodeList.name} onClick={() => handleChange(nodeList)} style={selectedNode?.name === nodeList.name ? { background: '#1994FC', borderRadius: '8px' } : {}}>
                        <CountryFlags style={{}} keyItem={nodeList.name} countryName={nodeList.country.toLowerCase()} />
                        <div>
                          <NodeName>{nodeList.name}</NodeName>
                          <NodeCountry>{nodeList.country}</NodeCountry>
                        </div>
                        <NodeCircle />
                      </NodeDetail>
                    )}
                  </NodeAccordionPanel>
                </NodeAccordionItem>
              )}
              {newValue && <NewExitNode onClick={setNewExitNode}>Create New: {newValue}</NewExitNode>}
            </NodeAccordion>
          }
        </Flex>
      </Stack>
    </Flex>
  );
};

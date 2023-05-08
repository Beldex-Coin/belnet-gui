import { Flex, Stack, Input, theme } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import Select, { components, GroupHeadingProps, MenuListProps, OptionProps, DropdownIndicatorProps, IndicatorSeparatorProps } from 'react-select';
import { useAppDispatch } from '../hooks';
import CountryFlags from './CountryImageSrc';
import { paddingDividers } from './Dividers';
import DropDownWhite from '../../../images/drop_down_white.svg';
import DropDownDark from '../../../images/drop_down_dark.svg';
// let defaultExitUse;

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
  padding: 10px 12px;
  outline: none;
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

const NodeCircle = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-left: 7px;
  background-color: ${(props) => props.theme.tabSelected};
`;
const DropdownIndicator = (
  props: DropdownIndicatorProps
) => {
  const themeSelected = useSelector(selectedTheme);
  return (
    <components.DropdownIndicator {...props}>
      {themeSelected === 'light' ? <img src={DropDownWhite} alt="white" /> : <img src={DropDownDark} alt="dark" />}
    </components.DropdownIndicator>
  );
};



const colourStyles = {
  control: (styles: any) => {
    const theme = useTheme();
    const themeSelected = useSelector(selectedTheme);
    const bgColour = theme.mainTabInputContainerColor;
    return ({
      ...styles, minHeight: '33px', height: '33px', backgroundColor: bgColour, border: 'none', boxShadow: 'none', borderRadius: '6px', transition: 'none', "&:hover": {
        boxShadow: "red"
      }
    })
  },
  input: (style: any, state: any) => {
    const theme = useTheme();
    return ({
      ...style,
      fontSize: 12,
      fontWeight: 400,
      width: 200,
      color: theme.tabSelected,
      '[type="text"]': {
        fontSize: 12,
        fontWeight: 400,
        color: theme.tabSelected,
      }
    })
  },
  option: (style: any, state: any) => {
    const theme = useTheme();
    return ({
      ...style,
      backgroundColor: state.isSelected ? '#1994FC' : theme.inputBackground,
      width: 'fit-content',
      padding: '0',
      minWidth: '100%',
      color: state.isSelected ? '#FFFFFF' : theme.menuListColor,
      textAlign: 'center'
    })
  },
  singleValue: (style: any, state: any) => {
    const theme = useTheme();
    return ({ ...style, color: theme.tabSelected })
  },
  clearIndicator: (style: any, state: any) => {
    const theme = useTheme();
    return ({ ...style, color: theme.exitNodeIconColor, padding: '4px 8px' })
  },
  menu: (style: any, state: any) => {
    const theme = useTheme();
    return ({
      ...style,
      backgroundColor: theme.inputBackground,
      margin: '4px 0px'
    })
  },
  menuList: (style: any, state: any) => {
    const theme = useTheme();
    return ({
      ...style,
      //background: 'red',
      maxHeight: '170px',
      "::-webkit-scrollbar": {
        width: "6px",
        height: "0px",
        borderRadius: '10px',
      },
      "::-webkit-scrollbar-track": {
        background: theme.scrollBar
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: '10px',
        background: theme.labelKeyColor
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: theme.scrollBar
      }
    })
  },
}
const promiseOptions = () =>
  new Promise<[]>((resolve) => {
    fetch("https://deb.beldex.io/Beldex-projects/Belnet/exitnodelist.json")
      .then(response => response.json())
      .then(data => {
        console.log('--data--', data);
        const exitNodeArr = data.map((item: any) => {
          const exitNodeList = item.node.map((list: any) => {
            return {
              label: list.name,
              value: list.name,
              ...list
            }
          }
          )
          return {
            label: item.type,
            options: [{}],
            length: exitNodeList.length,
            backup: exitNodeList
          }
        })
        resolve(exitNodeArr)
      })
  });

export const ExitPanel1 = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuList, setMenuList] = useState<any>();
  const [selectedNode, setNode] = useState<any>({});
  const exitStatus = useSelector(selectExitStatus);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode
  const disableInputEdits =
    exitStatus.exitLoading || Boolean(exitStatus.exitNodeFromDaemon);
  const exitToUse = disableInputEdits
    ? exitStatus.exitNodeFromDaemon
    : exitStatus.exitNodeFromUser;
  // const exitDaemon = exitStatus.exitNodeFromDaemon;
  // defaultExitUse = exitToUse;

  const promiseOptions1 = () =>
    new Promise<[]>((resolve) => {
      console.log('--promise---', menuList)
      resolve(menuList);
    });


  useEffect(() => {
    promiseOptions().then((list: any) => {
      setMenuList(list);
      // setdefaultMenuList(list);
    })
  }, [])

  useEffect(() => {
    promiseOptions1().then(list => {
      console.log('---')
    })
  }, [menuList])
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
  // const getRandomExitNode = () => {
  //   const maxMenuLenIndex = menuList.length - 1;
  //   const min = 0;
  //   const randomExitNodeIndex = Math.floor(Math.random() * (maxMenuLenIndex - min + 1) + min);
  //   const randomExitNode : any = menuList[randomExitNodeIndex]
  //   dispatch(onUserExitNodeSet(randomExitNode?.value))
  //   return randomExitNode
  // }

  const handleChange = (e: any) => {
    if (e) {
      dispatch(onUserExitNodeSet(e.value))
    }
  };

  const handleCreate = (e: any) => {
    console.log('--e---', e);
  }
  const onMenuOpen = () => {
    console.log('--defaultMenu--', menuList)
    
    setIsMenuOpen(true)};
  const onMenuClose = () => {
    const defaultMenu = menuList.map((list: any) => {
      return {
        ...list,
        options: [{}]
      }
    })
    console.log('--defaultMenu--', defaultMenu)

    setMenuList(defaultMenu);
    setIsMenuOpen(false)
  };

  const groupStyles = {
    color: 'white',
    background: 'red',
    padding: '5px 0px',
    display: 'flex',
  };


  const Option = (props: OptionProps) => {
    const node: any = props.data;
    return (
      <components.Option {...props}>
        {node && node.name && <NodeDetail
          //  onClick={() => handleChange(props.data)} 
          style={selectedNode?.name === node.name ? { background: '#1994FC', borderRadius: '8px' } : {}}>
          <CountryFlags style={{}} keyItem={node.name} countryName={node.country.toLowerCase()} />
          <div>
            <NodeName>{node.name}</NodeName>
            <NodeCountry>{node.country}</NodeCountry>
          </div>
          <NodeCircle />
        </NodeDetail>}
      </components.Option>
    );
  };

  const formatOptionLabel = (props: any) => {
    return (
      <div>
        <p>image</p>
        <p>image</p>
        <p>image</p>
      </div>
    )
  }

  const toggleOption = (e: any, selectedGroup: string) => {
    console.log('---selectedGroup---', selectedGroup)
    console.log('---menuList---', menuList);
    const updatedMenuList = menuList.map((item: any) => {
      if (item.label === selectedGroup) {
        if (item.options && item.options[0]?.name) {
          item.options = [{}]
        } else {
          item.options = item.backup;
        }
      }
      return item;
    })

    setMenuList(updatedMenuList)


  }

  const GroupHeading = (
    props: GroupHeadingProps
  ) => {
    return (
      <div style={groupStyles}>
        <components.GroupHeading {...props} onClick={(e) => toggleOption(e, props.children)}>
          <p>{props.children}</p>
          <p>{props.data?.length} Nodes</p>
        </components.GroupHeading>
      </div>
    )
  };
  const IndicatorSeparator = (props: IndicatorSeparatorProps) => {
    const indicatorSeparatorStyle = {
      alignSelf: 'stretch',
      backgroundColor: theme.exitNodeIconColor,
      marginBottom: 8,
      marginTop: 8,
      width: 1,
    };
    return isMenuOpen ? <span style={indicatorSeparatorStyle} {...props} /> : null;
  };

  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
    >
      <Stack direction="row" alignSelf="center" width="100%" height="100%">
        <Flex flexDirection="column" flexGrow={1}>
          <InputLabel>Exit Node</InputLabel>
          {disableInputEdits ? <ExitInput
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
          /> :
            <AsyncCreatableSelect
              isDisabled={disableInputEdits}
              // isSearchable={false}
              allowCreateWhileLoading={true}
              isClearable={isMenuOpen}
              onChange={handleChange}
              onCreateOption={handleCreate}
              // cacheOptions
              defaultOptions
              // loadOptions={menuList}
              loadOptions={promiseOptions1}
              styles={colourStyles}
              //filterOption={filterOption}
              onMenuOpen={onMenuOpen}
              onMenuClose={onMenuClose}
              components={{
                DropdownIndicator,
                IndicatorSeparator,
                GroupHeading,
                Option
              }}
            // formatOptionLabel={formatOptionLabel}
            // defaultValue={getRandomExitNode}
            />}
          {/* <InputLabel>Auth Code</InputLabel>

          <ExitInput
            disabled={disableInputEdits}
            spellCheck={false}
            onChange={(e: any) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            onPaste={(e: any) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            size="sm"
            variant="flushed"
            value={exitStatus.exitAuthCodeFromUser || ''}
            marginBottom={2}
            noOfLines={1}
          /> */}
        </Flex>
      </Stack>
    </Flex>
  );
};

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
import Select, { components, DropdownIndicatorProps, IndicatorSeparatorProps } from 'react-select';
import { useAppDispatch } from '../hooks';
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
      margin: '4px 0'
    })
  },
  menuList: (style: any, state: any) => {
    const theme = useTheme();
    return ({
      ...style,
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
    fetch("https://deb.beldex.io/Beldex-projects/Belnet/exitlist.json")
      .then(response => response.json())
      .then(data => {
        const exitNodeArr = data.map((item: any) => {
          return {
            value: item.name,
            label: item.name
          }
        })
        resolve(exitNodeArr)
      })
  });


export const ExitPanel = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuList, setMenuList] = useState([]);
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

  useEffect(() => {
    promiseOptions().then((list: any) => {
      setMenuList(list)
    })
  }, [])

  const getRandomExitNode = () => {
    const maxMenuLenIndex = menuList.length - 1;
    const min = 0;
    const randomExitNodeIndex = Math.floor(Math.random() * (maxMenuLenIndex - min + 1) + min);
    const randomExitNode : any = menuList[randomExitNodeIndex]
    dispatch(onUserExitNodeSet(randomExitNode?.value))
    return randomExitNode
  }

  const handleChange = (e: any) => {
    if (e) {
      dispatch(onUserExitNodeSet(e.value))
    }
  };

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);
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
              isSearchable={false}
              // isClearable={isMenuOpen}
              onChange={handleChange}
              cacheOptions
              defaultOptions
              loadOptions={promiseOptions}
              styles={colourStyles}
              onMenuOpen={onMenuOpen}
              onMenuClose={onMenuClose}
              components={{
                DropdownIndicator,
                IndicatorSeparator
              }}
              defaultValue={getRandomExitNode}
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

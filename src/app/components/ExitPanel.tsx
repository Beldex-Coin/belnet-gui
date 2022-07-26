import { Flex, Stack, Input } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { paddingDividers } from './Dividers';
import CreatableSelect from "react-select/creatable";
import { ActionMeta, OnChangeValue } from "react-select";

// let defaultExitUse;
// const exitNode = [
//   {value:defaultExitUse ||'' ,label:defaultExitUse || ''},
//   { value: "exit.beldex", label: "exit.beldex" },
//   { value: "test.beldex", label: "test.beldex" }
// ];



const ExitInput = styled(Input)`
  background-color: ${(props) => props.theme.inputBackground};
  color: ${(props) => props.theme.textColor};
  outline-color: transparent;
  font-family: 'IBM Plex Mono';
  font-weight: 400;
  border-radius: 3px;
  border: none;
  font-size: 1.1rem;
  padding: 5px;
  outline: none;
  transition: 0.5s;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
`;

const InputLabel = styled.div`
  font-family: Archivo;
  font-style: normal;
  font-weight: 500;
  font-size: 1.1rem;
  text-align: start;
  user-select: none;
`;

export const ExitPanel = (): JSX.Element => {
  const exitStatus = useSelector(selectExitStatus);
  const dispatch = useAppDispatch();

  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode
  const disableInputEdits =
    exitStatus.exitLoading || Boolean(exitStatus.exitNodeFromDaemon);
  console.log("disableInputEdits   ", disableInputEdits);

  const exitToUse = disableInputEdits
    ? exitStatus.exitNodeFromDaemon
    : exitStatus.exitNodeFromUser;
  // const exitDaemon = exitStatus.exitNodeFromDaemon;
  console.log("exitStatus.exitNodeFromDaemon ",exitStatus.exitNodeFromDaemon);
  console.log("exitStatus.exitNodeFromUser ",exitStatus.exitNodeFromUser);
  console.log("exitToUse ",exitToUse);
  // defaultExitUse = exitToUse;
  const handleChange = (e: any) => {
    if (e) {
      dispatch(onUserExitNodeSet(e.value))

      console.log(e.value);
    }
  };
  const exitNode = [
    { value: "8zhrwu36op5y6kz51qbwzgde1wrnhzmf8y14u7whmaiao3njn11y.beldex", label: "8zhrwu36op5y6kz51qbwzgde1wrnhzmf8y14u7whmaiao3njn11y.beldex" },
    { value: "exittest.beldex", label: "exittest.beldex" },
    { value: "test.beldex", label: "test.beldex" }
  ];
  // useEffect(()=> {
  //   exitNode.unshift({value:exitToUse ||'' ,label:exitToUse || ''});
  // }, [])

  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
      paddingLeft={paddingDividers}
      paddingRight={paddingDividers}
    >
      <Stack direction="row" alignSelf="center" width="100%" height="100%">
        <Flex flexDirection="column" flexGrow={1}>
          <InputLabel>EXIT NODE</InputLabel>
          {disableInputEdits ? <ExitInput
            disabled={disableInputEdits}
            onChange={(e) =>
              dispatch(onUserExitNodeSet(e?.currentTarget?.value))
            }
            onPaste={(e) =>
              dispatch(onUserExitNodeSet(e?.currentTarget?.value))
            }
            size="sm"
            variant="flushed"
            marginBottom={2}
            spellCheck={false}
            noOfLines={1}
            value={exitToUse || ''}
          /> :
            <CreatableSelect
              isDisabled={disableInputEdits}
              isClearable={true}
              onChange={handleChange}
              options={exitNode}
              defaultValue={{value:exitStatus.exitNodeFromUser, label:exitStatus.exitNodeFromUser}}
            />}
          <InputLabel>AUTH CODE</InputLabel>

          <ExitInput
            disabled={disableInputEdits}
            spellCheck={false}
            onChange={(e) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            onPaste={(e) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            size="sm"
            variant="flushed"
            value={exitStatus.exitAuthCodeFromUser || ''}
            marginBottom={2}
            noOfLines={1}
          />
        </Flex>
      </Stack>
    </Flex>
  );
};

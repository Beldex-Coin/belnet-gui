import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTheme } from '../../../features/uiStatusSlice';
import {
  selectAuthCodeFromUser,
  selectExitNodeFromUser
} from '../../../features/exitStatusSlice';
import { turnExitOn, turnExitOff } from './PowerButtonActions';
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';
import DarkThemePowerOn from "./power_on.svg";
import DarkThemePowerOff from "./power_off.svg";
import LightThemePowerOn from "./power_on_white.svg";
import LightThemePowerOff from "./power_off_white.svg";

export const PowerButtonIcon = (): JSX.Element => {
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const [power_on, setPowerOn] = useState(false);

  const connectingStatus = useGlobalConnectingStatus();
  const dispatch = useDispatch();

  const authCodeFromUser = useSelector(selectAuthCodeFromUser);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);
  const setPowerStatus = () => {
      if (connectingStatus === 'connecting' || connectingStatus === 'error-start-stop') {
        setPowerOn(!power_on);
        return;
      }
      if (connectingStatus === 'connected') {
        setPowerOn(!power_on);
        turnExitOff(dispatch);
      } else {
        setPowerOn(!power_on);
        turnExitOn(dispatch, exitNodeFromUser, authCodeFromUser);
      }
  }
  return (
    <>
      {themeType === 'light' && <div style={{margin: 'auto'}} onClick={() => setPowerStatus()}>
      {power_on ? <img height="216" width="222" src={LightThemePowerOn} alt=""/> : <img height="216" width="222" src={LightThemePowerOff} alt=""/>}
        </div>}
        {themeType === 'dark' && <div style={{margin: 'auto'}} onClick={() => setPowerStatus()}>
        {power_on ? <img height="216" width="222" src={DarkThemePowerOn} alt=""/> : <img height="216" width="222" src={DarkThemePowerOff} alt=""/>}
        </div>}
      {/* {power_on ? <img height="214" width="214" src={DarkThemePowerOn} alt=""/> : <img height="214" width="214" src={DarkThemePowerOff} alt=""/>} */}
      
    </>
  );
};


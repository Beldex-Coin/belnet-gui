import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTheme } from '../../../features/uiStatusSlice';
import {
  selectAuthCodeFromUser,
  selectExitNodeFromUser
} from '../../../features/exitStatusSlice';
import { turnExitOn, turnExitOff } from './PowerButtonActions';
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';
import PowerOnDarkSvg from './PowerOnDarkSvg';
import PowerOffDarkSvg from './PowerOffDarkSvg';
import PowerOnWhiteSvg from './PowerOnWhiteSvg';
import PowerOffWhiteSvg from './PowerOffWhiteSvg';

export const PowerButtonIcon = (): JSX.Element => {
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const connectingStatus = useGlobalConnectingStatus();
  // the tunnel stays up across a node switch, so the icon stays "on"
  const isPoweredOn = (status: string) =>
    status === 'connected' || status === 'switching';
  const [power_on, setPowerOn] = useState(isPoweredOn(connectingStatus));
  const dispatch = useDispatch();
  useEffect(() => {
    setPowerOn(isPoweredOn(connectingStatus))
  }, [connectingStatus])
  const authCodeFromUser = useSelector(selectAuthCodeFromUser);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);
  const setPowerStatus = () => {
    if (
      connectingStatus === 'connecting' ||
      connectingStatus === 'switching' ||
      connectingStatus === 'error-start-stop'
    ) {
      // a node switch owns the exit mapping until it settles
      return;
    } else if (connectingStatus === 'error-add-exit' && exitNodeFromUser) {
      turnExitOn(dispatch, exitNodeFromUser, authCodeFromUser);
    }
    if (connectingStatus === 'connected') {
      // setPowerOn(false);
      turnExitOff(dispatch);
    } else {
      // setPowerOn(true);
      turnExitOn(dispatch, exitNodeFromUser, authCodeFromUser);
    }
  }
  return (
    <>
      {themeType === 'light' && <div style={{ margin: 'auto' }} onClick={() => setPowerStatus()}>
        {power_on ? <PowerOnWhiteSvg /> : <PowerOffWhiteSvg />}
      </div>}
      {themeType === 'dark' && <div style={{ margin: 'auto' }} onClick={() => setPowerStatus()}>
        {power_on ? <PowerOnDarkSvg /> : <PowerOffDarkSvg />}
      </div>}
    </>
  );
};


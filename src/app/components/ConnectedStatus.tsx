import React from 'react';
import BelnetLogo from '../../../images/Belnet.svg';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectedTheme } from '../../features/uiStatusSlice';
import {
  isGlobalStatusError,
  useGlobalConnectingStatus
} from '../hooks/connectingStatus';

const ConnectedStatusContainer = styled.div`
  height: 40px;
  display: flex;
  line-height: 25px;
  margin-top: 0;

  justify-content: center;
  align-items: center;
`;

const ConnectedStatusContainerWithLogo = styled(ConnectedStatusContainer)`
  display: block;
  margin-top: 0 !important;
  height: 20px;
`;

const ConnectedStatusTitle = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  user-select: none;`;

const ConnectedStatusLED = styled.span<{ ledColor: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-left: 7px;
  background-color: ${(props) => props.ledColor};
`;

const StyledLogoAndTitle = styled.svg`
  height: 100%;
  margin-bottom: 0;
  fill: ${(props) => props.theme.labelKeyColor};
`;

export const ConnectedStatus = (): JSX.Element => {
  const globalStatus = useGlobalConnectingStatus();
  const themeType = useSelector(selectedTheme);
  console.log('--globalStatus---', globalStatus);
  if (isGlobalStatusError(globalStatus)) {
    const errorText =
      status === 'error-start-stop'
        ? 'FAILED TO START BELNET'
        : 'UNABLE TO CONNECT';
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle>{errorText}</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#F33232" />
      </ConnectedStatusContainer>
    );
  }

  if (globalStatus === 'connecting') {
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle>CONNECTING</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#EBD619" />
      </ConnectedStatusContainer>
    );
  }
  if (globalStatus === 'connected') {
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle>
          CONNECTED
        </ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#37EB19" />
      </ConnectedStatusContainer>
    );
  }
  return <>
    <ConnectedStatusContainer>
      <ConnectedStatusTitle>CONNECTING</ConnectedStatusTitle>
      <ConnectedStatusLED ledColor="#EBD619" />
    </ConnectedStatusContainer>
    {/* <ConnectedStatusContainer>
      <ConnectedStatusTitle>
        CONNECTED
      </ConnectedStatusTitle>
      <ConnectedStatusLED ledColor="#37EB19" />
    </ConnectedStatusContainer> */}
  </>;
  // <div style={{margin: 'auto'}}>
  //   <img width="235" height="40" src={BelnetLogo} alt="Belnet Logo" />
  // </div> 
};

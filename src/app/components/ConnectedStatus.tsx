import React from 'react';
import BelnetLogo from '../../../images/Belnet.svg';
import LineWhite from '../../../images/line_white.svg';
import LineDark from '../../../images/line_dark.svg';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectedTheme } from '../../features/uiStatusSlice';
import {
  isGlobalStatusError,
  useGlobalConnectingStatus
} from '../hooks/connectingStatus';

const ConnectedStatusContainer = styled.div`
  display: flex;
  margin: 8px 0 14px;
  justify-content: center;
  align-items: center;
`;

const TextLineImage = styled.div`
height: 2px;
    display: flex;
    justify-content: center;`;

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

  if (isGlobalStatusError(globalStatus)) {
    const errorText =
      status === 'error-start-stop'
        ? 'FAILED TO START BELNET'
        : 'Disconnected';
    return (
      <div>
      <ConnectedStatusContainer>
        <ConnectedStatusTitle>{errorText}</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#F33232" />
      </ConnectedStatusContainer>
       <TextLineImage>
       {themeType === 'light' ? <img src={LineWhite} alt="" /> : <img src={LineDark} alt="" />}
       </TextLineImage>
       </div>
    );
  }

  if (globalStatus === 'connecting') {
    return (
      <div>
      <ConnectedStatusContainer>
        <ConnectedStatusTitle>Connecting</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#EBD619" />
      </ConnectedStatusContainer>
      <TextLineImage>
      {themeType === 'light' ? <img src={LineWhite} alt="" /> : <img src={LineDark} alt="" />}
      </TextLineImage>
      </div>
    );
  }
  if (globalStatus === 'connected') {
    return (
      <div>
      <ConnectedStatusContainer>
        <ConnectedStatusTitle>Connected</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#37EB19" />
      </ConnectedStatusContainer>
      <TextLineImage>
      {themeType === 'light' ? <img src={LineWhite} alt="" /> : <img src={LineDark} alt="" />}
      </TextLineImage>
      </div>
    );
  }
  return <div>
    <ConnectedStatusContainer>
      <ConnectedStatusTitle>Disconnected</ConnectedStatusTitle>
      <ConnectedStatusLED ledColor="#F33232" />
    </ConnectedStatusContainer>
    <TextLineImage>
    {themeType === 'light' ? <img src={LineWhite} alt="" /> : <img src={LineDark} alt="" />}
    </TextLineImage>
    {/* <ConnectedStatusContainer>
      <ConnectedStatusTitle>
        CONNECTED
      </ConnectedStatusTitle>
      <ConnectedStatusLED ledColor="#37EB19" />
    </ConnectedStatusContainer> */}
  </div>;
  // <div style={{margin: 'auto'}}>
  //   <img width="235" height="40" src={BelnetLogo} alt="Belnet Logo" />
  // </div> 
};

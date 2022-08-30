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

const ConnectedStatusTitle = styled.span<{ textShadow: string }>`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
  user-select: none;
  text-shadow: ${(props) => props.textShadow};
`;

const ConnectedStatusLED = styled.span<{ ledColor: string }>`
  width: 1rem;
  height: 1em;
  border-radius: 50%;
  margin-left: 1rem;
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
        : 'UNABLE TO CONNECT';
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle textShadow="">{errorText}</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#F33232" />
      </ConnectedStatusContainer>
    );
  }

  if (globalStatus === 'connecting') {
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle textShadow="">CONNECTING</ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#EBD619" />
      </ConnectedStatusContainer>
    );
  }
  if (globalStatus === 'connected') {
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle
          textShadow={themeType == 'light' ? '' : '0px 0px 3px #FFFFFF'}
        >
          CONNECTED
        </ConnectedStatusTitle>
        <ConnectedStatusLED ledColor="#37EB19" />
      </ConnectedStatusContainer>
    );
  }
  return (
    <div>
      <img width="235" height="40" src={BelnetLogo} alt="Belnet Logo" />
    </div> 
  );
};

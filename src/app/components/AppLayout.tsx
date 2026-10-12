import { Stack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ConnectedStatus } from './ConnectedStatus';
import { GeneralInfos } from './GeneralInfos';
import { GuiTabs } from './GuiTabs';
import { PowerButton } from './PowerButton/PowerButton';
import { ChangeNodeButton } from './ChangeNodeButton';
import { ChangeNodeScreen } from './ChangeNodeScreen';
import { TitleBar } from './TitleBar';
import { UploadInfo } from './UploadInfo';
import { DownloadInfo } from './DownloadInfo';
import {
  useGlobalConnectingStatus
} from '../hooks/connectingStatus';
import { selectChangeNodeScreenOpen } from '../../features/uiStatusSlice';
import AnimationDots from "../../../images/Animation_dots.svg";
import BelnetLogo from '../../../images/Belnet.svg';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.backgroundOpacity};
`;

const ConnectionInfo = styled.div`
  display: flex;
  justify-content: space-around;
  flex-flow: row wrap;
  align-items: stretch;
`;

export const AppLayout = (): JSX.Element => {
  const globalStatus = useGlobalConnectingStatus();
  const changeNodeOpen = useSelector(selectChangeNodeScreenOpen);
  // the tunnel is nominally up while a swap is in flight, so keep the
  // connected backdrop rather than flashing it off and on
  const showConnectedBackdrop =
    globalStatus === 'connected' || globalStatus === 'switching';

  return (
    <Container>
      {showConnectedBackdrop && <img src={AnimationDots} style={{ position: 'absolute', top: '0%' }} width="auto" height="auto" />}
      <TitleBar />
      <Stack
        padding="0px 25px 0 25px"
        width="100%"
        height="0px"
        flexGrow={1}
        zIndex="1"
      >
        <div style={{ margin: 'auto' }}>
          <img width="235" height="40" src={BelnetLogo} alt="Belnet Logo" />
        </div>
        <GeneralInfos />
        <ConnectionInfo>
          <DownloadInfo />
          <PowerButton />
          <UploadInfo />
        </ConnectionInfo>
        <ChangeNodeButton />
        <ConnectedStatus />
        <GuiTabs />
      </Stack>
      {changeNodeOpen && <ChangeNodeScreen />}
    </Container>
  );
};

import { Stack } from '@chakra-ui/react';
import React from 'react';
import styled from 'styled-components';
import { ConnectedStatus } from './ConnectedStatus';
import { GeneralInfos } from './GeneralInfos';
import { GuiTabs } from './GuiTabs';
import { PowerButton } from './PowerButton/PowerButton';
import { TitleBar } from './TitleBar';
import {UploadInfo} from './UploadInfo';
import {DownloadInfo} from './DownloadInfo';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.backgroundOpacity};
`;

export const AppLayout = (): JSX.Element => {
  return (
    <Container>
      <TitleBar />
      <Stack
        padding="0px 25px 0 25px"
        width="100%"
        height="0px"
        flexGrow={1}
      >
        <ConnectedStatus />
        <GeneralInfos />
       <div>
       <DownloadInfo />
        <PowerButton />
        <UploadInfo />
       </div>

        <GuiTabs />
      </Stack>
    </Container>
  );
};

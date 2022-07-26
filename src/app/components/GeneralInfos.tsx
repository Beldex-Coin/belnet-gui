import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectBelnetAddress,
  selectUptime,
  selectVersion
} from '../../features/statusSlice';
import { LabelSubtleWithValue } from './LabelSubtleWithValue';
import styled from 'styled-components';

const formatUptime = (uptimeInMs: number) => {
  const seconds = uptimeInMs / 1000;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' min, ' : ' mins, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' sec' : ' secs') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

const GeneralInfosContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin: auto !important;
`;

export const GeneralInfos = (): JSX.Element => {
  const uptime = useSelector(selectUptime);
  const version = useSelector(selectVersion);
  const belnetAddress = useSelector(selectBelnetAddress);

  const formattedUptime = formatUptime(uptime);
  return (
    <GeneralInfosContainer>
      <LabelSubtleWithValue label="Uptime" value={formattedUptime} />
      <LabelSubtleWithValue
        label="Version"
        value={version}
        showCopyToClipBoard={true}
      />
      <LabelSubtleWithValue
        label="Belnet address"
        value={belnetAddress}
        showCopyToClipBoard={true}
      />
    </GeneralInfosContainer>
  );
};

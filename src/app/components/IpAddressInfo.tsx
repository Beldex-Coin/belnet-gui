import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  DEFAULT_VPN_IP,
  selectIpAddress
} from '../../features/ipAddressSlice';
import { useGlobalConnectingStatus } from '../hooks/connectingStatus';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 12px;
`;

const Box = styled.div`
  display: flex;
  width: 100%;
  border-radius: 6px;
  box-shadow: #747484 0px 0px 1px 0px;
  background: ${(props) => props.theme.mainTabInputContainerColor};
`;

const Cell = styled.div`
  flex: 1;
  min-width: 0;
  padding: 8px 14px;
  & + & {
    border-left: solid 1px ${(props) => props.theme.labelKeyColor};
  }
`;

const Label = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: ${(props) => props.theme.streamLabelColor};
  user-select: none;
`;

type Tone = 'normal' | 'muted' | 'ok';

const Value = styled.div<{ tone: Tone }>`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) =>
    props.tone === 'ok'
      ? props.theme.tabSelected
      : props.tone === 'muted'
      ? props.theme.labelValueColor
      : props.theme.appLogContentColor};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: text;
`;

/** Public IP (before connecting) and VPN IP (after connecting), below the chart. */
export const IpAddressInfo = (): JSX.Element => {
  const status = useGlobalConnectingStatus();
  const { publicIp, publicIpLoading, vpnIp, vpnIpLoading } = useSelector(
    selectIpAddress
  );
  const isConnected = status === 'connected';

  const publicText = publicIp || (publicIpLoading ? 'Fetching…' : '—');
  const vpnText =
    vpnIpLoading && vpnIp === DEFAULT_VPN_IP ? 'Fetching…' : vpnIp;

  return (
    <Wrapper>
      <Box>
        <Cell title={publicIp || ''}>
          <Label>Public IP</Label>
          <Value tone={publicIp ? 'normal' : 'muted'}>{publicText}</Value>
        </Cell>
        <Cell title={vpnIp}>
          <Label>VPN IP</Label>
          <Value tone={isConnected && vpnIp !== DEFAULT_VPN_IP ? 'ok' : 'muted'}>
            {vpnText}
          </Value>
        </Cell>
      </Box>
    </Wrapper>
  );
};

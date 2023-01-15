import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectedTheme } from '../../features/uiStatusSlice';
import {
  makeRate, selectStatus,
  selectDownloadRate,
  selectUploadRate
} from '../../features/statusSlice';
import { Flex } from '@chakra-ui/react';
import DownloadWhiteIcon from '../../../images/download_white.svg';
import DownloadDarkIcon from '../../../images/download_dark.svg';
import UploadWhiteIcon from '../../../images/upload_white.svg';
import UploadDarkIcon from '../../../images/upload_dark.svg';

const SpeedLabelHeading = styled.div`
color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  text-align: start;
  user-select: none;
  padding: 10px 0;
`;

const UploadDownloadIcon = styled.img`
height: 11px;
width: 9px;
margin: auto 7px auto 0px;
`;
const DownSpeedValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  padding: 0px 4px 0 10px;
  color: ${(props) => props.theme.tabSelected};
`;
const DownSpeedUnit = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => props.theme.tabSelected};
`;

const SpeedDetailsWrapper = styled.div`
    height: 39px;
    padding: 9px 21px;
    display: flex;
    box-shadow: #747484 0px 0px 1px 0px;
    background: ${(props) => props.theme.mainTabInputContainerColor};
    justify-content: space-between;
    width: 100%;
    border-radius: 6px;
`;

const SpeedLabel = styled.div`
  color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  display:flex;
  font-style: normal;
  font-weight: 400;
  align-items: center;
  font-size: 12px;`
  ;

const UploadSpeedValue = styled.span`
font-size: 14px;
font-weight: 600;
padding: 0px 4px 0 10px;
font-family: 'Poppins', sans-serif;
color: ${(props) => props.theme.activePathColor};
`;
const UploadSpeedUnit = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => props.theme.activePathColor};
  `;

export const SpeedStats = (): JSX.Element => {
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const upSpeed: any = useSelector(selectUploadRate);
  const downSpeed: any = useSelector(selectDownloadRate);

  return (
    <div style={{ width: '100%' }}>
      <SpeedLabelHeading>Speeds</SpeedLabelHeading>
      <SpeedDetailsWrapper>
        <Flex>
        {themeType === 'light' ? <UploadDownloadIcon src={DownloadWhiteIcon} alt="" /> : <UploadDownloadIcon src={DownloadDarkIcon} alt="" />}
          <SpeedLabel>Download</SpeedLabel>
            <DownSpeedValue>{downSpeed.split(' ')[0]}</DownSpeedValue>
            <DownSpeedUnit>{`${downSpeed.split(' ')[1]}/s`}</DownSpeedUnit>
         
        </Flex>

        <SpeedLabel>
          <svg height="21" width="8">
            <circle cx="2" cy="12" r="2" stroke-width="1" fill="#A1A1C1" />
          </svg>
        </SpeedLabel>
        <Flex>
        {themeType === 'light' ? <UploadDownloadIcon src={UploadWhiteIcon} alt="" /> : <UploadDownloadIcon src={UploadDarkIcon} alt="" />}
          <SpeedLabel>Upload</SpeedLabel>
            <UploadSpeedValue>{upSpeed.split(' ')[0]}</UploadSpeedValue>
            <UploadSpeedUnit>{`${upSpeed.split(' ')[1]}/s`}</UploadSpeedUnit>
        </Flex>
      </SpeedDetailsWrapper>
    </div>
  )
};

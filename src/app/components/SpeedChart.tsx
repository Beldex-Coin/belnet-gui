import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import {
  VictoryChart,
  VictoryGroup,
  VictoryArea,
  VictoryAxis,
  VictoryLabel
} from 'victory';
import { selectedTheme, selectSelectedTab } from '../../features/uiStatusSlice';
import {
  makeRate,
  selectSpeedHistory,
  selectDownloadRate,
  selectUploadRate
} from '../../features/statusSlice';
import DownloadWhiteIcon from '../../../images/download_white.svg';
import DownloadDarkIcon from '../../../images/download_dark.svg';
import UploadWhiteIcon from '../../../images/upload_white.svg';
import UploadDarkIcon from '../../../images/upload_dark.svg';
import { IpAddressInfo } from './IpAddressInfo';

const UploadDownloadIcon = styled.img`
height: 11px;
width: 9px;
margin-right: 5px;
`;

const SpeedLabel = styled.span`
  line-height: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 0 5px;`;

const DownSpeedValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  border-left: solid 1px #747484;
  padding: 0 4px;
  color: ${(props) => props.theme.tabSelected};
`;
const DownSpeedUnit = styled.span`
  font-size: 12px;
  font-weight: 300;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => props.theme.tabSelected};
`;

const UploadSpeedValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  border-left: solid 1px #747484;
  padding: 0 4px;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => props.theme.activePathColor};
  `;
const UploadSpeedUnit = styled.span`
  font-size: 12px;
  font-weight: 300;
  font-family: 'Poppins', sans-serif;
  color: ${(props) => props.theme.activePathColor};
  `;
export type NumberQueue = Array<number>;
export type SpeedHistoryDataType = {
  upload: NumberQueue;
  download: NumberQueue;
};

export const MAX_NUMBER_POINT_HISTORY = 60; // 2 minutes: one point per 2s poll

export const SpeedChart = React.memo((): JSX.Element | null => {
  // subscribe only to what this component actually renders
  const speedHistory = useSelector(selectSpeedHistory);
  const selectedTab = useSelector(selectSelectedTab);
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const upSpeed : any= useSelector(selectUploadRate);
  const downSpeed : any= useSelector(selectDownloadRate);

  const uploadCoordinates = React.useMemo(
    () =>
      speedHistory.upload.map((y, index) => ({
        x: index,
        y
      })),
    [speedHistory.upload]
  );

  const downloadCoordinates = React.useMemo(
    () =>
      speedHistory.download.map((y, index) => ({
        x: index,
        y
      })),
    [speedHistory.download]
  );

  // Victory charts are expensive: skip rendering entirely while the
  // chart tab (index 1) is not the visible one.
  if (selectedTab !== 1) {
    return null;
  }

  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        flexDirection="column"
        alignItems="center"
        maxWidth="500px"
        width="100%"
      >
        <VictoryChart
          animate={false}
          domainPadding={20}
          theme={{
            axis: {
              style: {
                axis: { stroke: theme.labelKeyColor },
                axisLabel: { stroke: theme.chartLabel },
                tickLabels: { fill: theme.chartLabel },
                grid: { stroke: 'none' }
              }
            }
          }}
          minDomain={{ x: 1, y: 1 }}
          width={510}
          // shorter than before to make room for the IP address panel
          height={150}
          padding={{ left: 65, top: 0, right: 0, bottom: 25 }}
        >
          <VictoryAxis
            dependentAxis={true}
            domain={[0, 1]}
            minDomain={1}
            tickCount={3}
            tickLabelComponent={<VictoryLabel dx={-10} />}
            tickFormat={(t) => makeRate(t, true)}
          />

          <VictoryAxis
            domain={[-40, 0]}
            padding={30}
            dependentAxis={false}
            tickLabelComponent={<VictoryLabel dx={-25} dy={10} />}
            tickFormat={(t) => {
              return t === 60 ? 'now' : t === 10 ? 'a minute ago' : '';
            }}
          />
          <VictoryGroup
            style={{
              data: { fillOpacity: 0 }
            }}
          >
            <VictoryArea
              style={{
                data: { stroke: theme.tabSelected, fill: theme.tabSelected }
              }}
              interpolation="natural"
              data={downloadCoordinates}
            />
            <VictoryArea
              style={{
                data: { stroke: theme.activePathColor, fill: theme.activePathColor }
              }}
              interpolation="natural"
              data={uploadCoordinates}
            />
          </VictoryGroup>
        </VictoryChart>
        <Flex
          direction="row"
          width="100%"
          alignSelf="center"
          justifyContent="space-between"
          margin="12px 0 0"
        >
          <div>
            <svg height="16" width="5">
              <circle cx="2" cy="12" r="2.5" stroke-width="1" fill={theme.tabSelected} />
            </svg>
            <SpeedLabel>Download</SpeedLabel>
            {themeType === 'light' ? <UploadDownloadIcon src={DownloadWhiteIcon} alt="" /> : <UploadDownloadIcon src={DownloadDarkIcon} alt="" />}
            <DownSpeedValue>{downSpeed.split(' ')[0]}</DownSpeedValue>
            <DownSpeedUnit>{`${downSpeed.split(' ')[1]}ps`}</DownSpeedUnit>
          </div>
          <div>
            <svg height="16" width="5">
              <circle cx="2" cy="12" r="2.5" stroke-width="1" fill={theme.activePathColor} />
            </svg>
            <SpeedLabel>Upload</SpeedLabel>
            {themeType === 'light' ? <UploadDownloadIcon src={UploadWhiteIcon} alt="" /> : <UploadDownloadIcon src={UploadDarkIcon} alt="" />}
            <UploadSpeedValue>{upSpeed.split(' ')[0]}</UploadSpeedValue>
            <UploadSpeedUnit>{`${upSpeed.split(' ')[1]}ps`}</UploadSpeedUnit>
          </div>
        </Flex>
        <IpAddressInfo />
      </Flex>
    </Flex>
  );
});

SpeedChart.displayName = 'SpeedChart';

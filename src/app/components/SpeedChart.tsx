import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components';
import {
  VictoryChart,
  VictoryGroup,
  VictoryArea,
  VictoryAxis,
  VictoryLabel
} from 'victory';
import { selectedTheme } from '../../features/uiStatusSlice';
import {
  makeRate, selectStatus,
  selectDownloadRate,
  selectUploadRate
} from '../../features/statusSlice';
import DownloadWhiteIcon from '../../../images/download_white.svg';
import DownloadDarkIcon from '../../../images/download_dark.svg';
import UploadWhiteIcon from '../../../images/upload_white.svg';
import UploadDarkIcon from '../../../images/upload_dark.svg';



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
  lastUploadUsage: number | null;
  lastDownloadUsage: number | null;
};

export const MAX_NUMBER_POINT_HISTORY = 60; // 1 minute as there is 2 points per sec currently

export const SpeedChart = (): JSX.Element => {
  const daemonStatus = useSelector(selectStatus);
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const upSpeed = useSelector(selectUploadRate);
  const downSpeed = useSelector(selectDownloadRate);

  const uploadCoordinates = daemonStatus.speedHistory.upload.map((y, index) => {
    return {
      x: index,
      y
    };
  });

  const downloadCoordinates = daemonStatus.speedHistory.download.map(
    (y, index) => {
      return {
        x: index,
        y
      };
    }
  );

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
                axisLabel: { stroke: theme.labelKeyColor },
                tickLabels: { fill: theme.labelKeyColor },
                grid: { stroke: 'none' }
              }
            }
          }}
          minDomain={{ x: 0, y: 1 }}
          width={510}
          height={300}
          padding={{ left: 40, top: 0, right: 0, bottom: 25 }}
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
            domain={[-60, 0]}
            padding={30}
            dependentAxis={false}
            tickLabelComponent={<VictoryLabel dy={10} />}
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
          margin="5px 0 0"
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
      </Flex>
    </Flex>
  );
};

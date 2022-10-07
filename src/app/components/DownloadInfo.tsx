import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { selectedTheme } from '../../features/uiStatusSlice';
import DownloadWhiteIcon from '../../../images/download_white.svg';
import DownloadDarkIcon from '../../../images/download_dark.svg';

const DownloadContainer = styled.div`
    width: 65px;
    position: relative;
`;

const DownloadText = styled.span`
    font-size: 10px;
    padding-left: 5px;
    color: ${(props) => props.theme.labelKeyColor};

`;

const SpeedUnit = styled.span`
    font-size: 10px;
    font-weight: 300;
    padding-left: 5px;
    color: ${(props) => props.theme.streamLabelColor};
`;

const SpeedValue = styled.p`
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.streamLabelColor};
`;

const LabelWrapper = styled.div`
    width: 65px;
    position: absolute;
    bottom: 0;
    text-align: right;
`;
export const DownloadInfo = (): JSX.Element => {
    const themeType = useSelector(selectedTheme);
    return (
        <DownloadContainer>
            <LabelWrapper>
                <p>
                    {themeType === 'light' ? <img src={DownloadWhiteIcon} alt="" /> : <img src={DownloadDarkIcon} alt="" />}
                    <DownloadText>Download</DownloadText></p>
                <SpeedValue>
                    40.5
                    <SpeedUnit>Mbps</SpeedUnit>
                </SpeedValue>
            </LabelWrapper>
        </DownloadContainer>
    )
}
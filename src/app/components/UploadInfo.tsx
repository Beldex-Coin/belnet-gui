import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectedTheme } from '../../features/uiStatusSlice';
import {selectUploadRate} from '../../features/statusSlice';
import UploadWhiteIcon from '../../../images/upload_white.svg';
import UploadDarkIcon from '../../../images/upload_dark.svg';

const UploadContainer = styled.div`
width: 65px;
position: relative
`;

const UploadText = styled.span`
    font-size: 10px;
    padding-right: 5px;
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
    padding-top: 3px;
    color: ${(props) => props.theme.streamLabelColor};
`;

const LabelWrapper = styled.div`
position: absolute;
bottom: 20px;
right: 0px;
text-align: right;
`;

export const UploadInfo = (): JSX.Element => {
    const themeType = useSelector(selectedTheme);
    const upSpeed : any = useSelector(selectUploadRate);

    return (
        <UploadContainer>
            <LabelWrapper>
                <p>
                    <UploadText>Upload</UploadText>
                    {themeType === 'light' ? <img src={UploadWhiteIcon} alt="" /> : <img src={UploadDarkIcon} alt="" />}
                </p>
                <SpeedValue> {upSpeed.split(' ')[0]}<SpeedUnit>{`${upSpeed.split(' ')[1]}ps`}</SpeedUnit>
                </SpeedValue>
            </LabelWrapper>
        </UploadContainer>
    )
}
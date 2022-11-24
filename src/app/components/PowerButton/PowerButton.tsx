import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHover } from 'react-use';
import styled from 'styled-components';
import {
  selectAuthCodeFromUser,
  selectExitNodeFromUser
} from '../../../features/exitStatusSlice';

import { selectedTheme, ThemeType } from '../../../features/uiStatusSlice';
import {
  ConnectingStatus,
  isGlobalStatusError,
  useGlobalConnectingStatus
} from '../../hooks/connectingStatus';
import { turnExitOn, turnExitOff } from './PowerButtonActions';
import { PowerButtonIcon } from './PowerButtonIcon';
import { PowerButtonContainerBorder } from './PowerButtonSpinner';
/**
const StyledPowerButtonContainer = styled.div<{ shadow: string; bg: string }>`
  height: 38vw;
  width: 38vw;
  max-height: 140px;
  max-width: 140px;
  align-self: center;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: ${(props) => props.shadow};
  background-color: ${(props) => props.bg};
  margin: 37px 5px !important;
  cursor: pointer;
`;

const StyledPowerButton = styled.div`
  height: calc(38vw - 40px);
  width: calc(38vw - 40px);

  max-height: 100px;
  max-width: 100px;
  margin: 20px;
  border: 2px solid ${(props) => props.theme.labelKeyColor}
  position: absolute;
  border-radius: 50%;

  transition: 0.25s;

`;

const getPowerButtonStyles = (
  status: ConnectingStatus,
  themeType: ThemeType
) => {
  const shadow = getPowerButtonContainerShadowStyle(status, themeType);
  const buttonContainerBackground =
    themeType === 'light' ? '#FAFAFA' : '#000000';
  return { shadow, buttonContainerBackground };
};

const getPowerButtonContainerShadowStyle = (
  globalStatus: ConnectingStatus,
  themeType: ThemeType
) => {
  if (isGlobalStatusError(globalStatus)) {
    return themeType === 'light'
      ? '0px 0px 30px rgba(255, 0, 0, 0.61)'
      : `0px 0px 51px rgba(255, 33, 33, 0.8), 0px 0px 66px #000000`;
  }

  if (globalStatus === 'connecting') {
    return themeType === 'light'
      ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
      : `0px 0px 30px rgba(255, 255, 255, 0.18), 0px 0px 66px #000000`;
  }

  if (globalStatus === 'connected') {
    return themeType === 'light'
      ? '0px 0px 25px rgba(0, 0, 0, 0.55)'
      : `0px 0px 15px rgba(255, 255, 255, 0.48)`;
  }

  return themeType === 'light'
    ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
    : `0px 0px 66px #000000`;
};

export const PowerButton = (): JSX.Element => {
  const themeType = useSelector(selectedTheme);

  const [isHovered, setIsHovered] = useState(false);

  const connectingStatus = useGlobalConnectingStatus();
  const dispatch = useDispatch();

  const authCodeFromUser = useSelector(selectAuthCodeFromUser);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);

  const { shadow, buttonContainerBackground } = getPowerButtonStyles(
    connectingStatus,
    themeType
  );

  return (
    <StyledPowerButtonContainer
      shadow={shadow}
      bg={buttonContainerBackground}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={() => {
        if (
          connectingStatus === 'connecting' ||
          connectingStatus === 'error-start-stop'
        ) {
          return;
        }
        if (connectingStatus === 'connected') {
          turnExitOff(dispatch);
        } else {
          turnExitOn(dispatch, exitNodeFromUser, authCodeFromUser);
        }
      }}
    >
      <StyledPowerButton>
        <PowerButtonContainerBorder isHovered={isHovered}>
          <PowerButtonIcon isHovered={isHovered} />
        </PowerButtonContainerBorder>
      </StyledPowerButton>
    </StyledPowerButtonContainer>
  );
};
 */
const StyledSpinner = styled.div`
position: absolute;
top: 213px;
transform: rotate(0deg);
transition: transform 0.9s linear;
animation: rotate 15s infinite linear;

@keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
`;
export const PowerButton = (): JSX.Element => {
  const connectingStatus = useGlobalConnectingStatus();
  return (
    <div className='powerBtnContainer'>
       <PowerButtonIcon />
      {connectingStatus === 'connecting' && <StyledSpinner id="parent-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="216" height="216" viewBox="13 13 216 216">
          <defs>
            <linearGradient id="linear-gradient1" x1="0.21" y1="0.101" x2="0.87" y2="0.817" gradientUnits="objectBoundingBox">
              <stop offset="0" stop-color="#363656" />
              <stop offset="1" stop-color="#1a1a28" />
            </linearGradient>
            <filter id="Vector1" x="25.672" y="25.672" width="189.688" height="189.708" filterUnits="userSpaceOnUse">
              <feOffset />
              <feGaussianBlur stdDeviation="4" result="blur-5" />
              <feFlood flood-color="#0095e1" flood-opacity="0.502" />
              <feComposite operator="in" in2="blur-5" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter id="Vector1-2" x="184.38" y="115.903" width="30.48" height="41.463" filterUnits="userSpaceOnUse">
              <feOffset />
              <feGaussianBlur stdDeviation="4" result="blur-6" />
              <feFlood flood-color="#0095e1" flood-opacity="0.502" />
              <feComposite operator="in" in2="blur-6" />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>
          <g id="power_on1" transform="translate(-89 -208)">
            <g id="power1">
              <g id="Group1_18" data-name="Group 18">
                <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector1)">
                  <path id="Vector1-5" data-name="Vector1" d="M162.008,81.015a79.175,79.175,0,1,0-6.718,33.8,1.873,1.873,0,0,1,2.423-.988,1.808,1.808,0,0,1,.978,2.4,82.854,82.854,0,1,1,7-35.21,1.808,1.808,0,0,1-1.819,1.839,1.873,1.873,0,0,1-1.861-1.839Z" transform="translate(37.67 37.67)" fill="#0072dc" />
                </g>
                <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector1-2)">
                  <path id="Vector1-6" data-name="Vector" d="M158.786,105.285A79.176,79.176,0,0,0,161.511,91.9a1.873,1.873,0,0,1,2.021-1.662,1.808,1.808,0,0,1,1.644,2,82.855,82.855,0,0,1-2.886,14.174A1.808,1.808,0,0,1,160,107.6,1.873,1.873,0,0,1,158.786,105.285Z" transform="translate(37.67 37.67)" fill="#0072dc" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </StyledSpinner>}
    </div>
  )
}
import React from 'react';
import styled from 'styled-components';
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';
import { PowerButtonIcon } from './PowerButtonIcon';

const StyledSpinner = styled.svg`
  position: absolute;
  top: 215px;
  webkit-animation:spin 15s linear infinite;
  -moz-animation:spin 15s linear infinite;
  animation:spin 15s linear infinite;
  @-moz-keyframes spin { 
    100% { -moz-transform: rotate(360deg); } 
  }
  @-webkit-keyframes spin { 
      100% { -webkit-transform: rotate(360deg); } 
  }
  @keyframes spin { 
      100% { 
          -webkit-transform: rotate(360deg); 
          transform:rotate(360deg); 
      } 
  }
`;
export const PowerButton = (): JSX.Element => {
  const connectingStatus = useGlobalConnectingStatus();
  return (
    <div className='powerBtnContainer'>
      <PowerButtonIcon />
      {connectingStatus === 'connecting' &&
        <StyledSpinner xmlns="http://www.w3.org/2000/svg" width="216" height="216" viewBox="13 13 216 216">
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
        </StyledSpinner>
      }
    </div>
  )
}
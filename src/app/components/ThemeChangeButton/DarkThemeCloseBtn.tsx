import React from 'react';
import styled from 'styled-components';

const paddingDividers = '56px';

const StyledBorderIcon = styled.div`
width: ${paddingDividers};
height: ${paddingDividers};
flex-shrink: 0;
`;

const StyledSvgPlusIcon = styled.svg`
padding: 0px;
`;

export const DarkThemeCloseBtn = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="52" height="52" viewBox="0 0 52 52">
        <defs>
          <radialGradient id="radial-gradient" cx="0.689" cy="0.153" r="0.751" gradientTransform="translate(1.132 -0.397) rotate(116.378)" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#434352"/>
            <stop offset="1" stop-color="#1e1e2c"/>
          </radialGradient>
          <filter id="Rectangle_4" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse">
            <feOffset dx="-2" dy="2" />
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood flood-color="#0a0a0d"/>
            <feComposite operator="in" in2="blur"/>
            <feComposite in="SourceGraphic"/>
          </filter>
          <radialGradient id="radial-gradient-2" cx="0.689" cy="0.153" r="0.751" gradientTransform="translate(1.132 -0.397) rotate(116.378)" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#3b3b52"/>
            <stop offset="1" stop-color="#1e1e2c"/>
          </radialGradient>
          <filter id="Rectangle_4-2" x="10" y="2" width="40" height="40" filterUnits="userSpaceOnUse">
            <feOffset dx="2" dy="-2" />
            <feGaussianBlur stdDeviation="2" result="blur-2"/>
            <feFlood flood-color="#d5d5ff" flood-opacity="0.161"/>
            <feComposite operator="in" in2="blur-2"/>
            <feComposite in="SourceGraphic"/>
          </filter>
        </defs>
        <g id="close" transform="translate(-344 -19)">
          <g transform="matrix(1, 0, 0, 1, 344, 19)" filter="url(#Rectangle_4)">
            <rect id="Rectangle_4-3" data-name="Rectangle 4" width="28" height="28" rx="12" transform="translate(14 10)" fill="url(#radial-gradient)"/>
          </g>
          <g transform="matrix(1, 0, 0, 1, 344, 19)" filter="url(#Rectangle_4-2)">
            <rect id="Rectangle_4-4" data-name="Rectangle 4" width="28" height="28" rx="12" transform="translate(14 10)" fill="url(#radial-gradient-2)"/>
          </g>
          <path id="icons8-close" d="M4.676,3.99A.686.686,0,0,0,4.2,5.168L8.514,9.484,4.2,13.8a.686.686,0,1,0,.97.97l4.316-4.316L13.8,14.77a.686.686,0,1,0,.97-.97L10.454,9.484,14.77,5.168a.686.686,0,1,0-.97-.97L9.484,8.514,5.168,4.2A.686.686,0,0,0,4.676,3.99Z" transform="translate(362.516 33.52)" fill="#fff" stroke="#fff" stroke-width="1"/>
        </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

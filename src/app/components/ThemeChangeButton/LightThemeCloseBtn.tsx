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

export const LightThemeCloseBtn = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="44" height="44" viewBox="0 0 44 44">
  <defs>
    <radialGradient id="radial-gradient" cx="0.689" cy="0.153" r="0.762" gradientTransform="matrix(-0.515, 0.857, -0.857, -0.515, 1.175, -0.36)" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#fafafa"/>
      <stop offset="1" stop-color="#e0e0e0"/>
    </radialGradient>
    <filter id="Rectangle_4" x="0" y="4" width="40" height="40" filterUnits="userSpaceOnUse">
      <feOffset dx="-2" dy="2" />
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feFlood flood-color="#898989" flood-opacity="0.396"/>
      <feComposite operator="in" in2="blur"/>
      <feComposite in="SourceGraphic"/>
    </filter>
    <radialGradient id="radial-gradient-2" cx="0.808" cy="0.153" r="0.852" gradientTransform="matrix(-0.51, 0.86, -0.86, -0.51, 1.172, -0.362)" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#f5f5f5"/>
      <stop offset="1" stop-color="#d5d5d5"/>
    </radialGradient>
    <filter id="Rectangle_4-2" x="4" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
      <feOffset dx="2" dy="-2" />
      <feGaussianBlur stdDeviation="2" result="blur-2"/>
      <feFlood flood-color="#fff" flood-opacity="0.702"/>
      <feComposite operator="in" in2="blur-2"/>
      <feComposite in="SourceGraphic"/>
    </filter>
  </defs>
  <g id="close" transform="translate(-350 -21)">
    <g transform="matrix(1, 0, 0, 1, 350, 21)" filter="url(#Rectangle_4)">
      <rect id="Rectangle_4-3" data-name="Rectangle 4" width="28" height="28" rx="12" transform="translate(8 8)" fill="url(#radial-gradient)"/>
    </g>
    <g transform="matrix(1, 0, 0, 1, 350, 21)" filter="url(#Rectangle_4-2)">
      <rect id="Rectangle_4-4" data-name="Rectangle 4" width="28" height="28" rx="12" transform="translate(8 8)" fill="url(#radial-gradient-2)"/>
    </g>
    <path id="icons8-close" d="M4.676,3.99A.686.686,0,0,0,4.2,5.168L8.514,9.484,4.2,13.8a.686.686,0,1,0,.97.97l4.316-4.316L13.8,14.77a.686.686,0,1,0,.97-.97L10.454,9.484,14.77,5.168a.686.686,0,1,0-.97-.97L9.484,8.514,5.168,4.2A.686.686,0,0,0,4.676,3.99Z" transform="translate(362.516 33.52)" fill="#222" stroke="#222" stroke-width="1"/>
  </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

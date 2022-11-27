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

export const LightThemeMinimizeBtn = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="44" height="44" viewBox="0 0 44 44">
        <defs>
          <radialGradient id="radial-gradient" cx="0.689" cy="0.153" r="0.762" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#fafafa" />
            <stop offset="1" stop-color="#e0e0e0" />
          </radialGradient>
          <filter id="Rectangle_4" x="0" y="4" width="40" height="40" filterUnits="userSpaceOnUse">
            <feOffset dx="-2" dy="2" />
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood flood-color="#898989" flood-opacity="0.396" />
            <feComposite operator="in" in2="blur" />
            <feComposite in="SourceGraphic" />
          </filter>
          <radialGradient id="radial-gradient-2" cx="0.808" cy="0.153" r="0.852" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#f5f5f5" />
            <stop offset="1" stop-color="#d5d5d5" />
          </radialGradient>
          <filter id="Rectangle_4-2" x="4" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
            <feOffset dx="2" dy="-2" />
            <feGaussianBlur stdDeviation="2" result="blur-2" />
            <feFlood flood-color="#fff" flood-opacity="0.702" />
            <feComposite operator="in" in2="blur-2" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        <g id="minimize" transform="translate(-350 -21)">
          <g transform="matrix(1, 0, 0, 1, 350, 21)" filter="url(#Rectangle_4)">
            <rect id="Rectangle_4-3" data-name="Rectangle 4" width="28" height="28" rx="12" transform="translate(8 8)" fill="url(#radial-gradient)" />
          </g>
          <g transform="matrix(1, 0, 0, 1, 350, 21)" filter="url(#Rectangle_4-2)">
            <rect id="Rectangle_4-4" data-name="Rectangle 4" width="28" height="28" rx="12" transform="translate(8 8)" fill="url(#radial-gradient-2)" />
          </g>
          <line id="Line_4" data-name="Line 4" x2="9.5" transform="translate(367.25 46.5)" fill="none" stroke="#222" stroke-linecap="round" stroke-width="3" />
        </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

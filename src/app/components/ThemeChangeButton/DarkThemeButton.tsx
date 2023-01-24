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

export const DarkThemeButton = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="56" height="56" viewBox="0 0 45 56"
        fill="none"
      >
          <defs>
            <radialGradient id="radial-gradient" cx="0.689" cy="0.153" r="0.762" gradientTransform="matrix(-0.515, 0.857, -0.857, -0.515, 1.175, -0.36)" gradientUnits="objectBoundingBox">
              <stop offset="0" stop-color="#fafafa" />
              <stop offset="1" stop-color="#e0e0e0" />
            </radialGradient>
            <filter id="Rectangle_4" x="0" y="4" width="52" height="52" filterUnits="userSpaceOnUse">
              <feOffset dx="-2" dy="2" />
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood flood-color="#898989" flood-opacity="0.396" />
              <feComposite operator="in" in2="blur" />
              <feComposite in="SourceGraphic" />
            </filter>
            <radialGradient id="radial-gradient-2" cx="0.808" cy="0.153" r="0.852" gradientTransform="matrix(-0.51, 0.86, -0.86, -0.51, 1.172, -0.362)" gradientUnits="objectBoundingBox">
              <stop offset="0" stop-color="#f5f5f5" />
              <stop offset="1" stop-color="#d5d5d5" />
            </radialGradient>
            <filter id="Rectangle_4-2" x="4" y="0" width="52" height="52" filterUnits="userSpaceOnUse">
              <feOffset dx="2" dy="-2" />
              <feGaussianBlur stdDeviation="2" result="blur-2" />
              <feFlood flood-color="#fff" flood-opacity="0.702" />
              <feComposite operator="in" in2="blur-2" />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>
          <g id="light_theme" transform="translate(-346 -17)">
            <g id="dark_theme" transform="translate(354 25)">
              <g transform="matrix(1, 0, 0, 1, -8, -8)" filter="url(#Rectangle_4)">
                <rect id="Rectangle_4-3" data-name="Rectangle 4" width="40" height="40" rx="15" transform="translate(8 8)" fill="url(#radial-gradient)" />
              </g>
              <g transform="matrix(1, 0, 0, 1, -8, -8)" filter="url(#Rectangle_4-2)">
                <rect id="Rectangle_4-4" data-name="Rectangle 4" width="40" height="40" rx="15" transform="translate(8 8)" fill="url(#radial-gradient-2)" />
              </g>
            </g>
            <g id="icons8-moon_symbol_1" data-name="icons8-moon_symbol 1" transform="translate(363.526 32.794)">
              <rect id="icons8-moon_symbol_1-2" data-name="icons8-moon_symbol 1" width="22" height="22" transform="translate(0.474 0.206)" fill="none" />
              <path id="VectorDarkThemeBtn" d="M17.037,12.627A9,9,0,1,1,6.229,0,9,9,0,0,0,17.037,12.627Z" transform="translate(2.252 2.693)" fill="#222" />
            </g>
          </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

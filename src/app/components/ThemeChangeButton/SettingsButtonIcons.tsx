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

/** Settings button frame for the dark theme (same frame as the old theme button). */
export const DarkSettingsIcon = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="56" height="56" viewBox="0 0 56 56"
        fill="none"
      >
        <defs>
          <radialGradient id="settings-radial-dark" cx="0.689" cy="0.153" r="0.751" gradientTransform="translate(1.132 -0.397) rotate(116.378)" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#434352" />
            <stop offset="1" stopColor="#1e1e2c" />
          </radialGradient>
          <filter id="settings-shadow-dark" x="0" y="0" width="63" height="63" filterUnits="userSpaceOnUse">
            <feOffset dx="-2" dy="2" />
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#0a0a0d" />
            <feComposite operator="in" in2="blur" />
            <feComposite in="SourceGraphic" />
          </filter>
          <filter id="settings-shadow-dark-2" x="10" y="2" width="51" height="51" filterUnits="userSpaceOnUse">
            <feOffset dx="2" dy="-2"  />
            <feGaussianBlur stdDeviation="2" result="blur-2" />
            <feFlood floodColor="#d5d5ff" floodOpacity="0.161" />
            <feComposite operator="in" in2="blur-2" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        <g id="dark_theme" transform="translate(-340 -15)">
          <g transform="matrix(1, 0, 0, 1, 340, 15)" filter="url(#settings-shadow-dark)">
            <rect id="Rectangle_4-3" data-name="Rectangle 4" width="39" height="39" rx="15" transform="translate(14 10)" fill="url(#settings-radial-dark)" />
          </g>
          <g transform="matrix(1, 0, 0, 1, 340, 15)" filter="url(#settings-shadow-dark-2)">
            <rect id="Rectangle_4-4" data-name="Rectangle 4" width="39" height="39" rx="15" transform="translate(14 10)" fill="url(#settings-radial-dark)" />
          </g>
          <g id="settings_icon" transform="translate(362 33)">
            <g fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </g>
          </g>
        </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

/** Settings button frame for the light theme. */
export const LightSettingsIcon = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="56" height="56" viewBox="0 0 45 56"
        fill="none"
      >
          <defs>
            <radialGradient id="settings-radial-light" cx="0.689" cy="0.153" r="0.762" gradientTransform="matrix(-0.515, 0.857, -0.857, -0.515, 1.175, -0.36)" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#fafafa" />
              <stop offset="1" stopColor="#e0e0e0" />
            </radialGradient>
            <filter id="settings-shadow-light" x="0" y="4" width="52" height="52" filterUnits="userSpaceOnUse">
              <feOffset dx="-2" dy="2" />
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="#898989" floodOpacity="0.396" />
              <feComposite operator="in" in2="blur" />
              <feComposite in="SourceGraphic" />
            </filter>
            <radialGradient id="settings-radial-light-2" cx="0.808" cy="0.153" r="0.852" gradientTransform="matrix(-0.51, 0.86, -0.86, -0.51, 1.172, -0.362)" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#f5f5f5" />
              <stop offset="1" stopColor="#d5d5d5" />
            </radialGradient>
            <filter id="settings-shadow-light-2" x="4" y="0" width="52" height="52" filterUnits="userSpaceOnUse">
              <feOffset dx="2" dy="-2" />
              <feGaussianBlur stdDeviation="2" result="blur-2" />
              <feFlood floodColor="#fff" floodOpacity="0.702" />
              <feComposite operator="in" in2="blur-2" />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>
          <g id="light_theme" transform="translate(-346 -17)">
            <g id="dark_theme" transform="translate(354 25)">
              <g transform="matrix(1, 0, 0, 1, -8, -8)" filter="url(#settings-shadow-light)">
                <rect id="Rectangle_4-3" data-name="Rectangle 4" width="40" height="40" rx="15" transform="translate(8 8)" fill="url(#settings-radial-light)" />
              </g>
              <g transform="matrix(1, 0, 0, 1, -8, -8)" filter="url(#settings-shadow-light-2)">
                <rect id="Rectangle_4-4" data-name="Rectangle 4" width="40" height="40" rx="15" transform="translate(8 8)" fill="url(#settings-radial-light-2)" />
              </g>
            </g>
            <g id="settings_icon" transform="translate(362 33)">
              <g fill="none" stroke="#222" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </g>
            </g>
          </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

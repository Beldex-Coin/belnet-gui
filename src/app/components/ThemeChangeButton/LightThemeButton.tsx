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

export const LightThemeButton = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="56" height="56" viewBox="0 0 56 56"
        fill="none"
      >
        <defs>
          <radialGradient id="radial-gradient" cx="0.689" cy="0.153" r="0.751" gradientTransform="translate(1.132 -0.397) rotate(116.378)" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#434352" />
            <stop offset="1" stop-color="#1e1e2c" />
          </radialGradient>
          <filter id="Rectangle_4" x="0" y="0" width="63" height="63" filterUnits="userSpaceOnUse">
            <feOffset dx="-2" dy="2" />
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood flood-color="#0a0a0d" />
            <feComposite operator="in" in2="blur" />
            <feComposite in="SourceGraphic" />
          </filter>
          <filter id="Rectangle_4-2" x="10" y="2" width="51" height="51" filterUnits="userSpaceOnUse">
            <feOffset dx="2" dy="-2"  />
            <feGaussianBlur stdDeviation="2" result="blur-2" />
            <feFlood flood-color="#d5d5ff" flood-opacity="0.161" />
            <feComposite operator="in" in2="blur-2" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        <g id="dark_theme" transform="translate(-340 -15)">
          <g transform="matrix(1, 0, 0, 1, 340, 15)" filter="url(#Rectangle_4)">
            <rect id="Rectangle_4-3" data-name="Rectangle 4" width="39" height="39" rx="15" transform="translate(14 10)" fill="url(#radial-gradient)" />
          </g>
          <g transform="matrix(1, 0, 0, 1, 340, 15)" filter="url(#Rectangle_4-2)">
            <rect id="Rectangle_4-4" data-name="Rectangle 4" width="39" height="39" rx="15" transform="translate(14 10)" fill="url(#radial-gradient)" />
          </g>
          <g id="light_Theme" transform="translate(361.646 32.646)">
            <rect id="light_Theme-2" data-name="light_Theme" width="23" height="23" transform="translate(0.354 0.354)" fill="none" />
            <path id="VectorLightThemeBtn" d="M12.885.991v.991a.991.991,0,1,1-1.982,0V.991a.991.991,0,1,1,1.982,0ZM4.163,3.172a.978.978,0,0,1,.694.3l.694.694A.981.981,0,0,1,4.163,5.551l-.694-.694a.958.958,0,0,1,0-1.388.978.978,0,0,1,.694-.3Zm15.462,0a.978.978,0,0,1,.694.3.958.958,0,0,1,0,1.388l-.694.694a.981.981,0,0,1-1.388-1.388l.694-.694a.978.978,0,0,1,.694-.3Zm-.793,8.722a6.938,6.938,0,1,1-6.938-6.938A6.933,6.933,0,0,1,18.832,11.894ZM1.982,10.9a.991.991,0,1,1,0,1.982H.991a.991.991,0,1,1,0-1.982Zm20.815,0a.991.991,0,1,1,0,1.982h-.991a.991.991,0,1,1,0-1.982ZM5.551,18.238a.958.958,0,0,1,0,1.388l-.694.694a.981.981,0,0,1-1.388-1.388l.694-.694a.958.958,0,0,1,1.388,0Zm14.075,0,.694.694a.981.981,0,0,1-1.388,1.388l-.694-.694a.958.958,0,0,1,0-1.388.958.958,0,0,1,1.388,0Zm-6.74,3.568V22.8a.991.991,0,1,1-1.982,0v-.991a.991.991,0,1,1,1.982,0Z" transform="translate(0 0)" fill="#fff" />
          </g>
        </g>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

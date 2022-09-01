import React from 'react';
import styled from 'styled-components';

const paddingDividers = '12px';

const StyledBorderIcon = styled.div`
width: ${paddingDividers};
height: ${paddingDividers};
flex-shrink: 0;
`;

const StyledSvgPlusIcon = styled.svg`
padding: 0px;
`;

export const DarkThemeCopyButton = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg" 
        width="12" 
        height="12" 
        viewBox="0 0 12 12"
      >
          <path id="copy" d="M9.6,0V1.2H1.2V9.6H0V1.2A1.2,1.2,0,0,1,1.2,0Zm1.2,2.4A1.2,1.2,0,0,1,12,3.6v7.2A1.2,1.2,0,0,1,10.8,12H3.6a1.2,1.2,0,0,1-1.2-1.2V3.6A1.2,1.2,0,0,1,3.6,2.4ZM3.6,10.8h7.2V3.6H3.6Z" fill="#00a3ff"/>
      </StyledSvgPlusIcon>
    </StyledBorderIcon>
  );
};

import React from 'react';
import styled from 'styled-components';

const StyledHeading = styled.div`
color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-align: start;
  user-select: none;
`;

export const StatsSection = styled.div`
  display: flex;
  justify-items: start;
  flex-shrink: 0;
`;

export const StatsHeading = ({ title }: { title: string }): JSX.Element => {
  return <StyledHeading>{title}</StyledHeading>;
};

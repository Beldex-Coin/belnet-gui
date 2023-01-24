import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

const StyledIconButton = styled.button<{ size: string; theme: DefaultTheme }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  color: ${(props) => props.theme.labelKeyColor};

  flex-shrink: 0;
  border: none;
  cursor: pointer;
  background: none;
  transition: 0.25s linear;
  border-radius: 7px;
  padding: 5px;
  :hover {
    color: ${(props) => props.theme.labelValueColor};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const BelnetIconButton = (props: {
  size: string;
  title: string;
  icon: React.ReactElement;
  onClick: () => void;
}): JSX.Element => {
  return (
    <StyledIconButton
      size={props.size}
      onClick={props.onClick}
      title={props.title}
    >
      {props.icon}
    </StyledIconButton>
  );
};

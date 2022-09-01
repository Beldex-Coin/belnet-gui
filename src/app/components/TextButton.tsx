import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: 1px solid ${(props) => props.theme.labelKeyColor};
  color: ${(props) => props.theme.labelKeyColor};
  background-color: ${(props) => props.theme.backgroundColor};

  border-radius: 7px;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  width: fit-content;
  padding: 4px 27px;
  margin-inline-start: 10px;
  margin-inline-end: 10px;
  user-select: none;

  transition: 0.25s;
  border-radius: 7px;
  :hover {
    color: ${(props) => props.theme.labelValueColor};
    border: 1px solid ${(props) => props.theme.labelValueColor};
  }
`;

export const TextButton = (props: {
  text: string;
  title: string;
  onClick: () => void;
}): JSX.Element => {
  return (
    <StyledButton onClick={props.onClick} title={props.title}>
      {props.text}
    </StyledButton>
  );
};

import React from 'react';
import styled, { useTheme, DefaultTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectedTheme } from '../../features/uiStatusSlice';
import ClearWhite from "../../../images/clear_white.svg";
import ClearDark from "../../../images/clear_dark.svg";
import CopyWhite from "../../../images/copy_white.svg";
import CopyDark from "../../../images/copy_dark.svg";


const StyledButton = styled.button<{ text: string; theme: DefaultTheme }>`
    background: ${(props) => props.theme.textButtonBg};
    color: ${(props) => props.text === "Clear" ? props.theme.textButtonClearColor : props.theme.tabSelected};
    height: 38px;
    font-family: 'Poppins', sans-serif;
    width: 125px;
    border-radius: 15px;
    border: ${(props) => props.theme.textButtonBorder};
    ont-weight: 500;
    font-size: 15px;
    margin: 0 10px;
    box-shadow: ${(props) => props.theme.textButtonBoxSh};
`;

export const TextButton = (props: {
  text: string;
  title: string;
  onClick: () => void;
}): JSX.Element => {
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  let ClearImg = <></>;
  let CopyImg = <></>;
  if(themeType === 'light') {
    ClearImg = <img src={ClearWhite} alt="" />;
    CopyImg = <img src={CopyWhite} alt="" />;
  } else {
    ClearImg = <img src={ClearDark} alt="" />;
    CopyImg = <img src={CopyDark} alt="" />;
  }
  // theme.tabSelected
  return (
    <StyledButton onClick={props.onClick} text={props.text} title={props.title}>
      {props.text === "Clear" ? ClearImg : CopyImg} {props.text}
    </StyledButton>
  );
};

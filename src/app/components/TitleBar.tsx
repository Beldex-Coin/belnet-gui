import React from 'react';
import  {LightThemeButton}  from './ThemeChangeButton/LightThemeButton';
import  {DarkThemeButton}  from './ThemeChangeButton/DarkThemeButton';
import  {LightThemeCloseBtn}  from './ThemeChangeButton/LightThemeCloseBtn';
import  {DarkThemeCloseBtn}  from './ThemeChangeButton/DarkThemeCloseBtn';
import { RiCloseFill } from 'react-icons/ri';
import styled from 'styled-components';

import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import { useDispatch, useSelector } from 'react-redux';
import { minimizeToTray } from '../../ipc/ipcRenderer';

const Container = styled.div`
  z-index: 99;
  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  font-size: 2rem;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  flex-shrink: 0;
  padding: 10px;
`;

const StyledIconButton = styled.button`
  font-size: 2rem;
  color: ${(props) => props.theme.textColor};
  border: none;
  cursor: pointer;
  background: none;
  -webkit-app-region: no-drag;
  flex-shrink: 0;

  transition: 0.25s;
  :hover {
    color: ${(props) => props.theme.textColorSubtle};
  }
`;

export const TitleBar = (): JSX.Element => {
  const themeSelected = useSelector(selectedTheme);
  const dispatch = useDispatch();
  return (
    <Container>
      <StyledIconButton
        title="Switch theme dark/white"
        onClick={() => {
          dispatch(setTheme(themeSelected === 'light' ? 'dark' : 'light'));
        }}
        style={{ marginRight: 'auto' }}
      >
       {themeSelected === 'light' ?  <DarkThemeButton /> : <LightThemeButton/>}
      </StyledIconButton>

      <StyledIconButton title="Minimize to tray" onClick={minimizeToTray}>
      {themeSelected === 'light' ?  <LightThemeCloseBtn /> : <DarkThemeCloseBtn/>}
      </StyledIconButton>
    </Container>
  );
};

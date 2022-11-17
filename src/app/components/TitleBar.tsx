import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import  {LightThemeButton}  from './ThemeChangeButton/LightThemeButton';
import  {DarkThemeButton}  from './ThemeChangeButton/DarkThemeButton';
import  {LightThemeCloseBtn}  from './ThemeChangeButton/LightThemeCloseBtn';
import  {LightThemeMinimizeBtn}  from './ThemeChangeButton/LightThemeMinimizeBtn';
import  {DarkThemeMinimizeBtn}  from './ThemeChangeButton/DarkThemeMinimizeBtn';
import  {DarkThemeCloseBtn}  from './ThemeChangeButton/DarkThemeCloseBtn';
import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import { minimizeToTray } from '../../ipc/ipcRenderer';
import {
  useGlobalConnectingStatus
} from '../hooks/connectingStatus';
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
  padding: 15px 15px 5px 15px;
`;

const StyledIconButton = styled.button`
  font-size: 2rem;
  color: ${(props) => props.theme.labelKeyColor};
  border: none;
  cursor: pointer;
  background: none;
  -webkit-app-region: no-drag;
  flex-shrink: 0;

  transition: 0.25s;
  :hover {
    color: ${(props) => props.theme.labelValueColor};
  }
`;

export const TitleBar = (): JSX.Element => {
  const themeSelected = useSelector(selectedTheme);
  const dispatch = useDispatch();
  const globalStatus = useGlobalConnectingStatus();
  const closeButton = themeSelected === 'light' ?  <LightThemeCloseBtn /> : <DarkThemeCloseBtn/>;
  const minimizeButton = themeSelected === 'light' ?  <LightThemeMinimizeBtn /> : <DarkThemeMinimizeBtn/>;
      
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
        {globalStatus === 'connected' ? minimizeButton : closeButton}
      </StyledIconButton>
    </Container>
  );
};

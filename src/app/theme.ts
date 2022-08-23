import { DefaultTheme } from 'styled-components';
import WorldMapDarkTheme from '../../images/world_map_dark_theme.svg';
import WorldMapLightTheme from '../../images/world_map_white_theme.svg';

export const darkTheme = {
  backgroundImage: `url(${WorldMapDarkTheme})`,
  backgroundColor: '#181821',
  backgroundOpacity: 'rgb(24 24 33 / 75%)',
  textColor: '#ffffff',
  overlayBackground: 'linear-gradient(#20202B, #1C1C26)',
  textColorSubtle: '#bdbdbd',
  inputBackground: '#262626',
  inputTextColor: '#bdbdbd'
};

export const lightTheme: DefaultTheme = {
  backgroundImage: `url(${WorldMapLightTheme})`,
  backgroundColor: '#EBEBEB',
  backgroundOpacity: 'rgb(235 235 235 / 75%)',
  textColor: '#000000',
  overlayBackground: '#F4F4F4',
  textColorSubtle: '#6c6c6c',
  inputBackground: '#f4f4f4',
  inputTextColor: '#6c6c6c'
};

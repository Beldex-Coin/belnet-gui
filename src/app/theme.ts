import { DefaultTheme } from 'styled-components';
import WorldMapDarkTheme from '../../images/world_map_dark_theme.svg';
import WorldMapLightTheme from '../../images/world_map_white_theme.svg';

export const darkTheme = {
  backgroundImage: `url(${WorldMapDarkTheme})`,
  backgroundColor: '#181821',
  backgroundOpacity: 'rgb(24 24 33 / 75%)',
  labelKeyColor: '#747484',
  overlayBackground: 'linear-gradient(#20202B, #1C1C26)',
  labelValueColor: '#9797A9',
  inputBackground: '#262626',
  inputTextColor: '#bdbdbd'
};

export const lightTheme: DefaultTheme = {
  backgroundImage: `url(${WorldMapLightTheme})`,
  backgroundColor: '#EBEBEB',
  backgroundOpacity: 'rgb(235 235 235 / 75%)',
  labelKeyColor: '#707080',
  overlayBackground: '#F4F4F4',
  labelValueColor: '#555568',
  inputBackground: '#f4f4f4',
  inputTextColor: '#6c6c6c'
};

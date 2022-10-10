import { DefaultTheme } from 'styled-components';
import DesktopMapLight from '../../images/Desktop_map_white.svg';
import DesktopMapDark from '../../images/Desktop_map_dark.svg';

export const darkTheme = {
  backgroundImage: `url(${DesktopMapDark})`,
  backgroundColor: '#181821',
  backgroundOpacity: 'rgba(24, 24, 33, 0)',
  labelKeyColor: '#747484',
  overlayBackground: 'linear-gradient(#20202B, #1C1C26)',
  labelValueColor: '#9797A9',
  inputBackground: '#262626',
  streamLabelColor: '#A1A1C1',
  inputTextColor: '#bdbdbd'
};

export const lightTheme: DefaultTheme = {
  backgroundImage: `url(${DesktopMapLight})`,
  backgroundColor: '#EBEBEB',
  backgroundOpacity: 'rgba(235, 235, 235, 0)',
  labelKeyColor: '#707080',
  overlayBackground: '#F4F4F4',
  labelValueColor: '#555568',
  inputBackground: '#f4f4f4',
  inputTextColor: '#6c6c6c',
  streamLabelColor: '#56566F',

};

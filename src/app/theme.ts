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
  inputBackground: '#252532',
  streamLabelColor: '#A1A1C1',
  inputTextColor: '#bdbdbd',
  tabSelected: '#00DC00',
  textButtonBg: 'linear-gradient(45deg, #1c1b27, #23222e)',
  textButtonBoxSh: '#252432 -4px -4px 6px;',
  appLogBS: '#252432 0px 0px 6px;',
  textButtonClearColor: '#f20000',
  textButtonBorder: 'solid 1px #262434',
  appLogTimeStampColor: '#A1A1C1',
  appLogContentColor: '#FFFFFF',
  activePathColor: '#00A3FF',
  mainTabInputContainerColor: '#292937',
  exitNodeIconColor: '#56566F',
  menuListColor: '#FFFFFF',
  scrollBar: '#323241',
  aboutLabel: '#AEAEBC',
  modalBg: '#252532',
  aboutBelnetColor: '#23DC27'


};

export const lightTheme: DefaultTheme = {
  backgroundImage: `url(${DesktopMapLight})`,
  backgroundColor: '#f0f0f0',
  backgroundOpacity: 'rgba(235, 235, 235, 0)',
  labelKeyColor: '#707080',
  overlayBackground: '#F4F4F4',
  labelValueColor: '#555568',
  inputBackground: '#FFFFFF',
  inputTextColor: '#6c6c6c',
  streamLabelColor: '#56566F',
  tabSelected: '#00C000',
  textButtonBg: '#f3f0f0',
  textButtonBoxSh: '#cbcaca 3px 3px 5px;',
  appLogBS: '#cbcaca -3px -3px 6px;',
  textButtonClearColor: '#FF3030',
  textButtonBorder: 'solid 1px #d4d4d4',
  appLogTimeStampColor: '#8C8CB1',
  appLogContentColor: '#222222',
  activePathColor: '#007BFF',
  mainTabInputContainerColor: '#FFFFFF',
  exitNodeIconColor: '#D4D4D4',
  menuListColor: '#56566F',
  scrollBar: '#EBEBEB',
  aboutLabel: '#747484',
  modalBg: '#EBEBEB',
  aboutBelnetColor: '#1DC021'
};

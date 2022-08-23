import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundImage: string;
    backgroundColor: string;
    backgroundOpacity: string;
    overlayBackground: string;
    textColor: string;
    textColorSubtle: string;
    inputBackground: string;
    inputTextColor: string;
  }
}

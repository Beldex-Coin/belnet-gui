import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundImage: string;
    backgroundColor: string;
    backgroundOpacity: string;
    overlayBackground: string;
    labelKeyColor: string;
    labelValueColor: string;
    inputBackground: string;
    inputTextColor: string;
  }
}

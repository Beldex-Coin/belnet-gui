import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import {
  closeSettingsScreen,
  openAbout,
  persistAutoConnect,
  selectAutoConnect,
  selectedTheme,
  setAutoConnect,
  setTheme
} from '../../features/uiStatusSlice';
import { useAppDispatch } from '../hooks';

/* Same placement as the Change Node screen: just below the title bar, which
   stays usable (drag, minimise, close) above the overlay. */
const TITLE_BAR_OFFSET_PX = 46;

const Screen = styled.div`
  position: fixed;
  top: ${TITLE_BAR_OFFSET_PX}px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.modalBg};
  animation: settingsSlideUp 180ms ease-out;

  @keyframes settingsSlideUp {
    from {
      transform: translateY(14px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px 12px;
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.activePathColor};
    outline-offset: 1px;
  }
`;

const HeaderTitle = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.appLogContentColor};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 20px 20px;
`;

const Row = styled.div<{ $clickable?: boolean; $dark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 10px 14px;
  border-radius: 10px;
  /* the dark input colour equals the dark screen colour, so lift the rows */
  background: ${(props) =>
    props.$dark ? 'rgba(255, 255, 255, 0.05)' : props.theme.inputBackground};
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  text-align: left;
  border: none;
  width: 100%;
  font-family: 'Poppins', sans-serif;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.activePathColor};
    outline-offset: 1px;
  }
`;

const RowIcon = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.modalBg};
`;

const RowText = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const RowTitle = styled.div`
  font-size: 13.5px;
  font-weight: 500;
  color: ${(props) => props.theme.appLogContentColor};
`;

const RowNote = styled.div`
  font-size: 11px;
  line-height: 15px;
  margin-top: 2px;
  color: ${(props) => props.theme.streamLabelColor};
`;

const SwitchTrack = styled.button<{ $on: boolean }>`
  flex: 0 0 auto;
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.15s;
  background: ${(props) =>
    props.$on ? props.theme.tabSelected : props.theme.exitNodeIconColor};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${(props) => (props.$on ? '21px' : '3px')};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.15s;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.activePathColor};
    outline-offset: 2px;
  }
`;

const Switch = (props: {
  on: boolean;
  label: string;
  onChange: (on: boolean) => void;
}): JSX.Element => (
  <SwitchTrack
    type="button"
    role="switch"
    aria-checked={props.on}
    aria-label={props.label}
    $on={props.on}
    onClick={() => props.onChange(!props.on)}
  />
);

const BackArrow = ({ color }: { color: string }): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M10 3L5 8l5 5"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Chevron = ({ color }: { color: string }): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M4.5 2.5L8 6l-3.5 3.5"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThemeIcon = ({ color }: { color: string }): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const AutoConnectIcon = ({ color }: { color: string }): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const AboutIcon = ({ color }: { color: string }): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </g>
  </svg>
);

export const SettingsScreen = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const autoConnect = useSelector(selectAutoConnect);

  const close = () => dispatch(closeSettingsScreen());

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconColor = theme.streamLabelColor;
  const isDark = themeType !== 'light';

  return (
    <Screen role="dialog" aria-label="Settings">
      <Header>
        <BackButton type="button" onClick={close} aria-label="Back">
          <BackArrow color={theme.appLogContentColor} />
        </BackButton>
        <HeaderTitle>Settings</HeaderTitle>
      </Header>

      <List>
        <Row $dark={isDark}>
          <RowIcon>
            <ThemeIcon color={iconColor} />
          </RowIcon>
          <RowText>
            <RowTitle>Dark theme</RowTitle>
            <RowNote>{themeType === 'dark' ? 'On' : 'Off — light theme'}</RowNote>
          </RowText>
          <Switch
            on={themeType === 'dark'}
            label="Dark theme"
            onChange={(on) => dispatch(setTheme(on ? 'dark' : 'light'))}
          />
        </Row>

        <Row $dark={isDark}>
          <RowIcon>
            <AutoConnectIcon color={iconColor} />
          </RowIcon>
          <RowText>
            <RowTitle>Auto-connect</RowTitle>
            <RowNote>
              Connect to the nearest fast exit node when the app starts
            </RowNote>
          </RowText>
          <Switch
            on={autoConnect}
            label="Auto-connect"
            onChange={(on) => {
              persistAutoConnect(on);
              dispatch(setAutoConnect(on));
            }}
          />
        </Row>

        <Row
          as="button"
          type="button"
          $clickable
          $dark={isDark}
          onClick={() => dispatch(openAbout())}
        >
          <RowIcon>
            <AboutIcon color={iconColor} />
          </RowIcon>
          <RowText>
            <RowTitle>About BelNet</RowTitle>
            <RowNote>What BelNet, exit nodes and BNS names are</RowNote>
          </RowText>
          <Chevron color={theme.appLogContentColor} />
        </Row>
      </List>
    </Screen>
  );
};

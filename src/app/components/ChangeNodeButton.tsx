import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import { useAppDispatch } from '../hooks';
import { openChangeNodeScreen } from '../../features/uiStatusSlice';
import { selectIsSwappingExitNode } from '../../features/exitStatusSlice';

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0 2px;
`;

const StyledChangeNodeButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 0 18px;
  border-radius: 16px;
  border: ${(props) => props.theme.textButtonBorder};
  background: ${(props) => props.theme.textButtonBg};
  box-shadow: ${(props) => props.theme.appLogBS};
  color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.4px;
  user-select: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.55 : 1)};
  transition: opacity 120ms ease;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.activePathColor};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.activePathColor};
    outline-offset: 2px;
  }
`;

const Spinner = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.exitNodeIconColor};
  border-top-color: ${(props) => props.theme.activePathColor};
  animation: changeNodeSpin 700ms linear infinite;

  @keyframes changeNodeSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const SwapIcon = ({ color }: { color: string }): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M2.5 5.5h9M9.5 3l2.5 2.5L9.5 8M13.5 10.5h-9M6.5 8L4 10.5 6.5 13"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Sits directly under the power button and opens the Change Node screen.
 * Disabled while a switch is already in flight.
 */
export const ChangeNodeButton = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isSwapping = useSelector(selectIsSwappingExitNode);

  return (
    <ButtonRow>
      <StyledChangeNodeButton
        type="button"
        disabled={isSwapping}
        aria-label={isSwapping ? 'Switching exit node' : 'Change exit node'}
        onClick={() => {
          if (!isSwapping) {
            dispatch(openChangeNodeScreen());
          }
        }}
      >
        {isSwapping ? <Spinner /> : <SwapIcon color={theme.streamLabelColor} />}
        {isSwapping ? 'Switching…' : 'Change Node'}
      </StyledChangeNodeButton>
    </ButtonRow>
  );
};

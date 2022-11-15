import React from 'react';
import styled from 'styled-components';
import { LabelSubtleWithValue } from './LabelSubtleWithValue';


const RouterHeading = styled.div`
color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  text-align: start;
  user-select: none;
  padding: 10px 0;
`;

const RouterDetailsWrapper = styled.div`
    height: 39px;
    padding: 9px 21px;
    display: flex;
    box-shadow: #747484 0px 0px 1px 0px;
    background: ${(props) => props.theme.mainTabInputContainerColor};
    justify-content: space-between;
    width: 100%;
    border-radius: 6px;
`;

const RouterLabel = styled.div`
  color: ${(props) => props.theme.appLogContentColor};
  font-family: 'Poppins', sans-serif;
  display:flex;
  font-style: normal;
  font-weight: 400;
  align-items: center;
  font-size: 12px;`

  ;

const RouterValue = styled.div<{ type: string; }>`
  color: ${(props) => props.type === 'paths' ? props.theme.activePathColor : props.theme.tabSelected};
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  padding-left: 6px;
`;

export const RoutersStats = ({
  numRouters,
  activePaths,
  ratio
}: {
  numRouters: number;
  activePaths: number;
  ratio: string;
}): JSX.Element => (
  <div style={{ width: '100%' }}>
    <RouterHeading>Routers</RouterHeading>
    <RouterDetailsWrapper>
      <RouterLabel> Total Count:
        <RouterValue type="count">12</RouterValue>
      </RouterLabel>
      <RouterLabel>
        <svg height="21" width="8">
          <circle cx="2" cy="12" r="2" stroke-width="1" fill="#A1A1C1" />
        </svg>
      </RouterLabel>
      <RouterLabel> Active Paths:
        <RouterValue type="paths">13</RouterValue>
      </RouterLabel>
      <RouterLabel>
        <svg height="21" width="8">
          <circle cx="2" cy="12" r="2" stroke-width="1" fill="#A1A1C1" />
        </svg>
      </RouterLabel>
      <RouterLabel> Success:
        <RouterValue type="success">64%</RouterValue>
      </RouterLabel>
    </RouterDetailsWrapper>
  </div>
);

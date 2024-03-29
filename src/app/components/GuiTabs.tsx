import { Tab, TabList, useMultiStyleConfig, Button, Box, TabPanel, TabPanels, Tabs, useTab } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  selectSelectedTab,
  setTabSelected,
} from '../../features/uiStatusSlice';
import { AppLogs } from './AppLogs';
import { MainTab } from './MainTab';
import { SpeedChart } from './SpeedChart';


export const GuiTabs = (): JSX.Element => {
  const selectedTab = useSelector(selectSelectedTab);
  const dispatch = useDispatch();

  const theme = useTheme();
  const fgSelected = theme.tabSelected;

  const selectedStyle = {
    color: fgSelected,
    fontWeight: 600,
    fontSize: '18px'
  };

  const CustomTab = React.forwardRef((props: any) => {
      // 1. Reuse the `useTab` hook
      const tabProps = useTab({ ...props})
      // 2. Hook into the Tabs `size`, `variant`, props
      const styles = useMultiStyleConfig('Tabs', tabProps);
      const isSelected = !!tabProps['aria-selected']
      styles.tab = {
        fontSize: '15px',
        fontWeight: 400,
        color: theme.streamLabelColor,
        height: '25px'
      }
      return (
        <div>
        <Button _selected={selectedStyle} __css={styles.tab} {...tabProps}>
          {tabProps.children}
        </Button>
      {isSelected &&  <div style={{width: '6px', height: '6px', margin: '6px auto 0', background: fgSelected,borderRadius: '50%'}}></div>}
        </div>
      )
    })
  return (
    <Tabs
      height="0px"
      width="100%"
      padding="12px 0 0"
      display="flex"
      flexDir="column"
      flexGrow={1}
      index={selectedTab}
      onChange={(index: number) => {
        dispatch(
          setTabSelected(index === 0 ? 'main' : index === 1 ? 'chart' : 'logs')
        );
      }}
      isLazy={false}
      variant="unstyled"
    >
      <TabList justifyContent="space-evenly">
        <CustomTab >Main</CustomTab>
        <CustomTab >Chart</CustomTab>
        <CustomTab >Logs</CustomTab>
      </TabList>
      <TabPanels flexGrow={1} padding={1} height="0px">
        <TabPanel flexGrow={1}>
          <MainTab />
        </TabPanel>
        <TabPanel flexGrow={1}>
          <SpeedChart />
        </TabPanel>
        <TabPanel flexGrow={1} height="100%">
          <AppLogs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

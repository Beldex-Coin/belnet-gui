import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { ExitPanel } from './ExitPanel';
import { RoutersStats } from './RouterStats';

export const MainTab = (): JSX.Element => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  return (
    <>

      <ExitPanel />
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        // paddingLeft={paddingDividers}
        // paddingRight={paddingDividers}
        minWidth="300px"
      >
        <RoutersStats
          activePaths={daemonStatus.numPathsBuilt}
          ratio={daemonStatus.ratio}
          numRouters={daemonStatus.numRoutersKnown}
        />
      </Flex>
    </>
  );
};

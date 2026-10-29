import React from 'react';
import { useSelector } from 'react-redux';
import { Flex } from '@chakra-ui/react'
import {
  selectNumPathsBuilt,
  selectNumRoutersKnown,
  selectRatio
} from '../../features/statusSlice';
import { ExitPanel } from './ExitPanel';
import { RoutersStats } from './RouterStats';
import { SpeedStats } from './SpeedStats';


export const MainTab = (): JSX.Element => {
  // subscribe only to the 3 fields this tab displays, not the whole status
  const numPathsBuilt = useSelector(selectNumPathsBuilt);
  const numRoutersKnown = useSelector(selectNumRoutersKnown);
  const ratio = useSelector(selectRatio);

  return (
    <>
      <ExitPanel />
      
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        minWidth="300px"
      >
        <RoutersStats
          activePaths={numPathsBuilt}
          ratio={ratio}
          numRouters={numRoutersKnown}
        />
      </Flex>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        minWidth="300px"
      >
        <SpeedStats/>
        {/* <RoutersStats
          activePaths={daemonStatus.numPathsBuilt}
          ratio={daemonStatus.ratio}
          numRouters={daemonStatus.numRoutersKnown}
        /> */}
      </Flex>

    </>
  );
};

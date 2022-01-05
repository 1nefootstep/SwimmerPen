import React, { useMemo, useEffect, useRef } from 'react';
import { Center, Box, Divider, ScrollView } from 'native-base';

import { useAppDispatch, useAppSelector } from '../state/redux/hooks';

import { computeResult } from '../state/StatisticsCalculator';
import { saveAnnotation } from '../state/redux';
import VelocityChart from '../components/result/VelocityChart';
import StrokeCountChart from '../components/result/StrokeCountChart';
import StrokeRateChart from '../components/result/StrokeRateChart';
import Hidden from '../components/Hidden';
import DPSChart from '../components/result/DPSChart';

export default function ResultScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const annotationsInfo = useAppSelector(state => state.annotation);
  const { averageVelocities, strokeRates, strokeCounts, distancePerStroke } =
    useMemo(() => computeResult(annotationsInfo), [annotationsInfo]);
  return (
    <ScrollView alwaysBounceVertical={true}>
      <Center>
        <Hidden isHidden={averageVelocities.length === 0}>
          <>
            <Box py={4}>
              <VelocityChart velocities={averageVelocities} />
            </Box>
            <Divider thickness={4} bg="muted.300" />
          </>
        </Hidden>
        <Hidden isHidden={strokeCounts.length === 0}>
          <>
            <Box py={4}>
              <StrokeCountChart strokeCounts={strokeCounts} />
            </Box>
            <Divider thickness={4} bg="muted.300" />
          </>
        </Hidden>
        <Hidden isHidden={strokeRates.length === 0}>
          <>
            <Box py={4}>
              <StrokeRateChart strokeRates={strokeRates} />
            </Box>
            <Divider thickness={4} bg="muted.300" />
          </>
        </Hidden>
        <Hidden isHidden={distancePerStroke.length === 0}>
          <>
            <Box py={4}>
              <DPSChart dps={distancePerStroke} />
            </Box>
            <Divider thickness={4} bg="muted.300" />
          </>
        </Hidden>
      </Center>
    </ScrollView>
  );
}

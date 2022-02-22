import React, { useMemo, useRef, useEffect } from 'react';
import { Center, Box, Divider, ScrollView } from 'native-base';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAppDispatch, useAppSelector } from '../state/redux/hooks';
import {
  computeResult,
  DPSStatistic,
  fixAnnotationFrameTimes,
  StrokeCountStatistic,
  StrokeRateStatistic,
  TimeDistStatistic,
  VelocityAtRangeStatistic,
} from '../state/StatisticsCalculator';
import VelocityChart from '../components/result/VelocityChart';
import StrokeCountChart from '../components/result/StrokeCountChart';
import StrokeRateChart from '../components/result/StrokeRateChart';
import Hidden from '../components/Hidden';
import DPSChart from '../components/result/DPSChart';
import { formatTimeFromPositionSeconds } from '../state/Util';
import {
  createCsvInCacheDir,
  getAnnotationUri,
  getVideoUri,
  saveAnnotation,
} from '../FileHandler';
import SendFab from '../components/result/SendFab';
import { IconNode } from 'react-native-elements/dist/icons/Icon';

export default function MultiResultScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const annotationsInfo = useAppSelector(state => state.annotation);

  const {
    timeAndDistances,
    averageVelocities,
    strokeRates,
    lapStrokeCounts,
    strokeCounts,
    distancePerStroke,
  } = useMemo(() => computeResult(annotationsInfo), [annotationsInfo]);

  const viewShotRef = useRef<ViewShot | null>(null);
  useEffect(() => {
    const prev = annotationsInfo;
    const updated = fixAnnotationFrameTimes(annotationsInfo, dispatch);
    if (JSON.stringify(prev) !== JSON.stringify(updated)) {
      saveAnnotation(updated.name, updated);
    }
  }, []);

  const openShareDialogAsync = async (uri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(uri);
  };

  const shareFile = async (uri: string) => {
    const originalOrientation =
      await ScreenOrientation.getOrientationLockAsync();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
    openShareDialogAsync(uri)
      .catch(e => console.log(`Error: result screen ${e}`))
      .finally(async () => {
        await ScreenOrientation.lockAsync(originalOrientation);
      });
  };

  const takeScreenshot = async () => {
    if (
      viewShotRef.current !== null &&
      viewShotRef.current.capture !== undefined
    ) {
      const uri = await viewShotRef.current.capture();
      shareFile(uri);
    }
  };

  const items: Array<{
    label: string;
    icon: IconNode;
    action: (() => void) | (() => Promise<void>);
  }> = [
    {
      label: 'Send graph',
      icon: { name: 'linechart', type: 'antdesign' },
      action: takeScreenshot,
    },
  ];

  return (
    <>
      <ScrollView alwaysBounceVertical={true}>
        <ViewShot style={{ backgroundColor: '#fff' }} ref={viewShotRef}>
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
            <Hidden isHidden={lapStrokeCounts.length === 0}>
              <>
                <Box py={4}>
                  <StrokeCountChart strokeCounts={lapStrokeCounts} />
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
        </ViewShot>
      </ScrollView>
      <SendFab items={items} />
    </>
  );
}

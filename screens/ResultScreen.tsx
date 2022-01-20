import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Button, Center, Box, Divider, ScrollView, Text } from 'native-base';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAppSelector } from '../state/redux/hooks';
import { computeResult } from '../state/StatisticsCalculator';
import VelocityChart from '../components/result/VelocityChart';
import StrokeCountChart from '../components/result/StrokeCountChart';
import StrokeRateChart from '../components/result/StrokeRateChart';
import Hidden from '../components/Hidden';
import DPSChart from '../components/result/DPSChart';

export default function ResultScreen({ navigation }) {
  const annotationsInfo = useAppSelector(state => state.annotation);
  const {
    averageVelocities,
    strokeRates,
    lapStrokeCounts,
    strokeCounts,
    distancePerStroke,
  } = useMemo(() => computeResult(annotationsInfo), [annotationsInfo]);
  const viewShotRef = useRef<ViewShot | null>(null);

  const openShareDialogAsync = async (uri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(uri);
  };

  const takeScreenshot = async () => {
    if (
      viewShotRef.current !== null &&
      viewShotRef.current.capture !== undefined
    ) {
      const uri = await viewShotRef.current.capture();
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
    }
  };

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
            <Hidden isHidden={strokeCounts.length === 0}>
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
      <Box>
        <Button onPress={takeScreenshot}>
          <Text>Screenshot</Text>
        </Button>
      </Box>
    </>
  );
}

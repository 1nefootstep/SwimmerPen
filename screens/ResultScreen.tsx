import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Center, Box, Divider, ScrollView, Text } from 'native-base';
import { FloatingMenu } from 'react-native-floating-action-menu';
import { FontAwesome5 } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAppSelector } from '../state/redux/hooks';
import {
  computeResult,
  DPSStatistic,
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
import { createCsvInCacheDir, getVideoUri } from '../FileHandler';

interface FabItem {
  label: string;
  icon: string;
  action: FabAction;
}

type FabAction = 'screenshot' | 'csv' | 'video';

export default function ResultScreen({ navigation }) {
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
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const items: Array<FabItem> = [
    { label: 'Send graph', icon: 'chart-line', action: 'screenshot' },
    { label: 'Send CSV', icon: 'file-csv', action: 'csv' },
    { label: 'Send video', icon: 'file-video', action: 'video' },
  ];

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

  const toCsv = (
    td: Array<TimeDistStatistic>,
    sc: Array<StrokeCountStatistic>,
    v: Array<VelocityAtRangeStatistic>,
    sr: Array<StrokeRateStatistic>,
    dps: Array<DPSStatistic>
  ) => {
    const header: Array<string> = [];
    const values: Array<string> = [];
    td.forEach(e => {
      header.push(`${e.distance}m`);
      values.push(formatTimeFromPositionSeconds(e.time));
    });
    sc.forEach(e => {
      header.push(`SC ${e.startRange}-${e.endRange}m`);
      values.push(e.strokeCount.toFixed(2));
    });
    v.forEach(e => {
      header.push(`Velocity ${e.startRange}-${e.endRange}m`);
      values.push(e.velocity.toFixed(2));
    });
    sr.forEach(e => {
      header.push(`SR ${e.startRange}-${e.endRange}m`);
      values.push(e.strokeRate.toFixed(2));
    });
    dps.forEach(e => {
      header.push(`DPS ${e.startRange}-${e.endRange}m`);
      values.push(e.distancePerStroke.toFixed(2));
    });
    return `${header.join(',')}\n${values.join(',')}`;
  };

  const shareCsv = async () => {
    const uri = await createCsvInCacheDir(
      toCsv(
        timeAndDistances,
        strokeCounts,
        averageVelocities,
        strokeRates,
        distancePerStroke
      ),
      annotationsInfo.name !== '' ? annotationsInfo.name : Date.now().toString()
    );
    shareFile(uri);
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

  const shareVideo = async () => {
    if (annotationsInfo.name !== '') {
      shareFile(getVideoUri(annotationsInfo.name));
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

      <FloatingMenu
        items={items}
        isOpen={isFabOpen}
        onMenuToggle={() => setIsFabOpen(!isFabOpen)}
        onItemPress={(i: FabItem) => {
          switch (i.action) {
            case 'screenshot': {
              takeScreenshot();
              break;
            }
            case 'csv':
              shareCsv();
              break;
            case 'video':
              shareVideo();
              break;
          }
        }}
        renderItemIcon={(item, index, menuState) => {
          return <FontAwesome5 name={item.icon} size={24} color="black" />;
        }}
      />
    </>
  );
}

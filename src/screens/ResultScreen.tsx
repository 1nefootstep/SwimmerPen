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
import { NavigatorProps } from '../router';

export default function ResultScreen({ navigation }: NavigatorProps) {
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

  const shareRawAnnotations = async () => {
    if (annotationsInfo.name !== '') {
      // const ann = await loadAnnotation(annotationsInfo.name);
      // if (ann.isSuccessful) {
      //   console.log(`${annotationsInfo.name} annotations: ${JSON.stringify(ann.annotation.annotations)}`);
      // }
      shareFile(getAnnotationUri(annotationsInfo.name));
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
    {
      label: 'Send csv',
      icon: { name: 'file-csv', type: 'font-awesome-5' },
      action: shareCsv,
    },
    {
      label: 'Send video',
      icon: { name: 'file-video', type: 'font-awesome-5' },
      action: shareVideo,
    },
    {
      label: 'Send annotations',
      icon: { name: 'file-word', type: 'font-awesome-5' },
      action: shareRawAnnotations,
    },
  ];

  return (
    <>
      <ScrollView alwaysBounceVertical={true}>
        <ViewShot style={{ backgroundColor: '#fff' }} ref={viewShotRef}>
          <Center>
            <Hidden isHidden={averageVelocities.length === 0}>
              <Box py={4}>
                <VelocityChart
                  nameAndVelocities={[
                    { name: annotationsInfo.name, stats: averageVelocities },
                  ]}
                />
              </Box>
              <Divider thickness={4} bg="muted.300" />
            </Hidden>
            <Hidden isHidden={strokeCounts.length === 0}>
              <Box py={4}>
                <StrokeCountChart
                  nameAndStrokeCounts={[
                    { name: annotationsInfo.name, stats: strokeCounts },
                  ]}
                />
              </Box>
              <Divider thickness={4} bg="muted.300" />
            </Hidden>
            <Hidden isHidden={lapStrokeCounts.length === 0}>
              <Box py={4}>
                <StrokeCountChart
                  nameAndStrokeCounts={[
                    { name: annotationsInfo.name, stats: lapStrokeCounts },
                  ]}
                />
              </Box>
              <Divider thickness={4} bg="muted.300" />
            </Hidden>
            <Hidden isHidden={strokeRates.length === 0}>
              <Box py={4}>
                <StrokeRateChart
                  nameAndStrokeRates={[
                    {
                      name: annotationsInfo.name,
                      stats: strokeRates,
                    },
                  ]}
                />
              </Box>
              <Divider thickness={4} bg="muted.300" />
            </Hidden>
            <Hidden isHidden={distancePerStroke.length === 0}>
              <Box py={4}>
                <DPSChart
                  nameAndDps={[
                    {
                      name: annotationsInfo.name,
                      stats: distancePerStroke,
                    },
                  ]}
                />
              </Box>
              <Divider thickness={4} bg="muted.300" />
            </Hidden>
          </Center>
        </ViewShot>
      </ScrollView>
      <SendFab items={items} />
    </>
  );
}

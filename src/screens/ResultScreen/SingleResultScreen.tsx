import React, { useMemo, useRef, useEffect } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import {
  computeResult,
  DPSStatistic,
  fixAnnotationFrameTimes,
  StrokeCountStatistic,
  StrokeRateStatistic,
  TimeDistStatistic,
  VelocityAtRangeStatistic,
} from '../../state/StatisticsCalculator';
import { formatTimeFromPositionSeconds } from '../../state/Util';
import {
  createCsvInCacheDir,
  getAnnotationUri,
  getVideoUri,
  saveAnnotation,
} from '../../FileHandler';
import { NavigatorProps } from '../../router';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import BaseResultScreen from './BaseResultScreen';
import { Column } from 'native-base';

export default function SingleResultScreen({ navigation }: NavigatorProps) {
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

  const velocityData = useMemo(
    () => [{ name: annotationsInfo.name, stats: averageVelocities }],
    [averageVelocities]
  );
  const srData = useMemo(
    () => [{ name: annotationsInfo.name, stats: strokeRates }],
    [averageVelocities]
  );
  const scData = useMemo(
    () => [{ name: annotationsInfo.name, stats: strokeCounts }],
    [averageVelocities]
  );
  const lapScData = useMemo(
    () => [{ name: annotationsInfo.name, stats: lapStrokeCounts }],
    [averageVelocities]
  );
  const dpsData = useMemo(
    () => [{ name: annotationsInfo.name, stats: distancePerStroke }],
    [averageVelocities]
  );
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
    icon: IconSource;
    onPress: (() => void) | (() => Promise<void>);
  }> = [
    {
      label: 'Send graph',
      icon: 'chart-line',
      onPress: takeScreenshot,
    },
    {
      label: 'Send csv',
      icon: 'file-excel',
      onPress: shareCsv,
    },
    {
      label: 'Send video',
      icon: 'file-video',
      onPress: shareVideo,
    },
    {
      label: 'Send annotations',
      icon: 'file-word',
      onPress: shareRawAnnotations,
    },
  ];

  return (
    <Column safeAreaTop w="100%" flex={1}>
      <BaseResultScreen
        navigation={navigation}
        velocityData={velocityData}
        dpsData={dpsData}
        lapScData={lapScData}
        scData={scData}
        srData={srData}
        fabItems={items}
        viewShotRef={viewShotRef}
      />
    </Column>
  );
}

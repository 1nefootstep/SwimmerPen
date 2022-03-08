import React, {
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Center,
  Box,
  Divider,
  ScrollView,
  Row,
  IconButton,
  Text,
  StatusBar,
  Icon,
} from 'native-base';
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
import { NavigatorProps } from '../router';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import Table from '../components/result/Table';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { DefaultTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { useLayout } from '@react-native-community/hooks';
import { getOrientationAsync, Orientation } from 'expo-screen-orientation';

function AppBar({ onPressBack }: { onPressBack: () => void }) {
  const COLOR = '#fff';
  return (
    <>
      <StatusBar backgroundColor={COLOR} barStyle="light-content" />
      <Row
        bg={COLOR}
        px="1"
        py="3"
        justifyContent="space-between"
        shadow="9"
        w="100%"
      >
        <Row alignItems="center" h={6}>
          <IconButton
            icon={<Icon size="sm" as={MaterialIcons} name="arrow-back" />}
            onPress={onPressBack}
          />
          <Text mx={4} fontSize="16">
            Statistics
          </Text>
        </Row>
      </Row>
    </>
  );
}

export default function ResultScreen({ navigation }: NavigatorProps) {
  const dispatch = useAppDispatch();
  const annotationsInfo = useAppSelector(state => state.annotation);
  const [width, setWidth] = useState<number>(0);
  const { onLayout, width: w, height: h } = useLayout();

  const {
    timeAndDistances,
    averageVelocities,
    strokeRates,
    lapStrokeCounts,
    strokeCounts,
    distancePerStroke,
  } = useMemo(() => computeResult(annotationsInfo), [annotationsInfo]);

  const viewShotRef = useRef<ViewShot | null>(null);
  useLayoutEffect(() => {
    (async () => {
      const orientation = await getOrientationAsync();
      if (
        orientation === Orientation.LANDSCAPE_RIGHT ||
        orientation === Orientation.LANDSCAPE_LEFT
      ) {
        setWidth(w);
      } else {
        setWidth(h);
      }
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
      return () => {
        ScreenOrientation.getOrientationAsync()
          .then(currOrientation => {
            currOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
            currOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
              ? ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.LANDSCAPE
                )
              : null;
          })
          .catch(err => console.error(err));
      };
    })();
  }, [h, w]);

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
  const isAverageVelocitiesAvailable = averageVelocities.length !== 0;
  const isStrokeCountAvailable = strokeCounts.length !== 0;
  const isLapStrokeCountAvailable = lapStrokeCounts.length !== 0;
  const isDpsAvailable = distancePerStroke.length !== 0;
  const isStrokeRatesAvailable = strokeRates.length !== 0;
  const paperTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: '#0891b2' },
  };
  return (
    <Box flex={1}>
      <AppBar onPressBack={() => navigation.goBack()} />
      <Tabs
        // defaultIndex={0} // default = 0
        // uppercase={false} // true/false | default=true | labels are uppercase
        // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
        // iconPosition // leading, top | default=leading
        style={{ backgroundColor: '#fff' }} // works the same as AppBar in react-native-paper
        // dark={false} // works the same as AppBar in react-native-paper
        theme={paperTheme} // works the same as AppBar in react-native-paper
        // mode="scrollable" // fixed, scrollable | default=fixed
        // onChangeIndex={(newIndex) => {}} // react on index change
        // showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
        disableSwipe={true} // (default=false) disable swipe to left/right gestures
      >
        <TabScreen label="Table">
          <ScrollView onLayout={onLayout} alwaysBounceVertical={true}>
            <Center>
              <Hidden isHidden={!isAverageVelocitiesAvailable}>
                <Table
                  style={{ paddingHorizontal: 48 }}
                  title={[{ label: 'Velocity' }, { label: 'Speed (m/s)' }]}
                  rows={averageVelocities.map(e => [
                    {
                      label: `${e.startRange}m-${e.endRange}m`,
                    },
                    {
                      label: e.velocity.toFixed(1),
                    },
                  ])}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isStrokeCountAvailable}>
                <Table
                  style={{ paddingHorizontal: 48 }}
                  title={[{ label: 'Stroke Counts' }]}
                  rows={strokeCounts.map(e => [
                    {
                      label: `${e.startRange}m-${e.endRange}m`,
                    },
                    {
                      label: e.strokeCount.toFixed(1),
                    },
                  ])}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isLapStrokeCountAvailable}>
                <Table
                  style={{ paddingHorizontal: 48 }}
                  title={[{ label: 'Lap Stroke Counts' }]}
                  rows={lapStrokeCounts.map(e => [
                    {
                      label: `${e.startRange}m-${e.endRange}m`,
                    },
                    {
                      label: e.strokeCount.toFixed(1),
                    },
                  ])}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isStrokeRatesAvailable}>
                <Table
                  style={{ paddingHorizontal: 48 }}
                  title={[{ label: 'Stroke Rate' }, { label: 'stroke/min' }]}
                  rows={strokeRates.map(e => [
                    {
                      label: `${e.startRange}m-${e.endRange}m`,
                    },
                    {
                      label: e.strokeRate.toFixed(1),
                    },
                  ])}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isStrokeRatesAvailable}>
                <Table
                  style={{ paddingHorizontal: 48 }}
                  title={[{ label: 'Distance per Stroke' }, { label: 'm' }]}
                  rows={distancePerStroke.map(e => [
                    {
                      label: `${e.startRange}m-${e.endRange}m`,
                    },
                    {
                      label: e.distancePerStroke.toFixed(1),
                    },
                  ])}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
            </Center>
          </ScrollView>
        </TabScreen>
        <TabScreen label="Graph">
          <>
            <ScrollView alwaysBounceVertical={true}>
              <ViewShot style={{ backgroundColor: '#fff' }} ref={viewShotRef}>
                <Center>
                  <Hidden isHidden={!isAverageVelocitiesAvailable}>
                    <VelocityChart
                      nameAndVelocities={[
                        {
                          name: annotationsInfo.name,
                          stats: averageVelocities,
                        },
                      ]}
                      width={w}
                    />
                    <Divider thickness={4} bg="muted.300" />
                  </Hidden>
                  <Hidden isHidden={!isStrokeRatesAvailable}>
                    <Box py={4}>
                      <StrokeRateChart
                        nameAndStrokeRates={[
                          {
                            name: annotationsInfo.name,
                            stats: strokeRates,
                          },
                        ]}
                        width={w}
                      />
                    </Box>
                    <Divider thickness={4} bg="muted.300" />
                  </Hidden>
                  <Hidden isHidden={!isDpsAvailable}>
                    <Box py={4}>
                      <DPSChart
                        nameAndDps={[
                          {
                            name: annotationsInfo.name,
                            stats: distancePerStroke,
                          },
                        ]}
                        width={w}
                      />
                    </Box>
                    <Divider thickness={4} bg="muted.300" />
                  </Hidden>
                </Center>
              </ViewShot>
            </ScrollView>
            <SendFab items={items} />
          </>
        </TabScreen>
      </Tabs>
    </Box>
  );
}

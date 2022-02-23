import React, { useState, useRef, useEffect } from 'react';
import {
  Center,
  Box,
  Divider,
  ScrollView,
  StatusBar,
  Row,
  IconButton,
  Button,
  Column,
  Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAppDispatch, useAppSelector } from '../state/redux/hooks';
import {
  computeResult,
  fixAnnotationFrameTimes,
} from '../state/StatisticsCalculator';
import VelocityChart from '../components/result/VelocityChart';
import StrokeCountChart from '../components/result/StrokeCountChart';
import StrokeRateChart from '../components/result/StrokeRateChart';
import Hidden from '../components/Hidden';
import DPSChart from '../components/result/DPSChart';
import { loadAnnotation, saveAnnotation } from '../FileHandler';
import SendFab from '../components/result/SendFab';
import { IconNode } from 'react-native-elements/dist/icons/Icon';
import { AnnotationInformation } from '../state/AKB';

const COLOR = '#f5f5f4';

export default function ResultScreen({ navigation }) {
  const [annotationBaseNames, setAnnotationBaseNames] = useState<Array<string>>(
    []
  );
  const [annotationInfos, setAnnotationInfos] = useState<
    Array<AnnotationInformation>
  >([]);

  const viewShotRef = useRef<ViewShot | null>(null);
  useEffect(() => {
    async function getAnnotationInfo() {
      const aOrNull = await Promise.all(
        annotationBaseNames.map(async baseName => {
          const result = await loadAnnotation(baseName);
          if (result.isSuccessful) {
            const prev = result.annotation;
            const updated = fixAnnotationFrameTimes(prev);
            if (JSON.stringify(prev) !== JSON.stringify(updated)) {
              saveAnnotation(updated.name, updated);
            }
            return updated;
          }
          return null;
        })
      );
      const a: Array<AnnotationInformation> = aOrNull.filter(
        (e): e is AnnotationInformation => e !== null
      );
      setAnnotationInfos(a);
    }
    getAnnotationInfo();
  }, [annotationBaseNames]);

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

  const onPressBack = navigation.goBack;

  return (
    <Column>
      <StatusBar backgroundColor={COLOR} barStyle="light-content" />
      <Box safeAreaTop bg={COLOR} />
      <Row
        bg={COLOR}
        px="1"
        py="3"
        justifyContent="space-between"
        shadow="9"
        w="100%"
      >
        <Row alignItems="center">
          <IconButton
            icon={<Icon size="sm" as={MaterialIcons} name="arrow-back" />}
            onPress={onPressBack}
          />
        </Row>
        <Row>
          {hasSelection ? (
            <Text mx={4} fontSize="12">{`${selections.length} selected.`}</Text>
          ) : (
            <Text mx={4} fontSize="20" fontWeight="bold">
              Video Picker
            </Text>
          )}
        </Row>
        <Row mr={4}>
          {hasSelection ? (
            <IconButton
              icon={<CheckIcon size="sm" />}
              onPress={() => {
                onDone(selections);
                onPressBack();
              }}
            />
          ) : (
            <Button
              size="lg"
              variant="unstyled"
              onPress={() => {
                importVideoAndAnnotation()
                  .then(isSuccessful => {
                    console.log(isSuccessful);
                    if (isSuccessful) {
                      onImport();
                    }
                  })
                  .catch(err => console.error(`importing video error: ${err}`));
              }}
            >
              Compare annotations
            </Button>
          )}
        </Row>
      </Row>
      <ScrollView alwaysBounceVertical={true}>
        <ViewShot style={{ backgroundColor: '#fff' }} ref={viewShotRef}>
          <Center>
            <Hidden isHidden={averageVelocities.length === 0}>
              <>
                <Box py={4}>
                  <VelocityChart
                    nameAndVelocities={[
                      { name: annotationsInfo.name, stats: averageVelocities },
                    ]}
                  />
                </Box>
                <Divider thickness={4} bg="muted.300" />
              </>
            </Hidden>
            <Hidden isHidden={strokeCounts.length === 0}>
              <>
                <Box py={4}>
                  <StrokeCountChart
                    nameAndStrokeCounts={[
                      { name: annotationsInfo.name, stats: strokeCounts },
                    ]}
                  />
                </Box>
                <Divider thickness={4} bg="muted.300" />
              </>
            </Hidden>
            <Hidden isHidden={lapStrokeCounts.length === 0}>
              <>
                <Box py={4}>
                  <StrokeCountChart
                    nameAndStrokeCounts={[
                      { name: annotationsInfo.name, stats: lapStrokeCounts },
                    ]}
                  />
                </Box>
                <Divider thickness={4} bg="muted.300" />
              </>
            </Hidden>
            <Hidden isHidden={strokeRates.length === 0}>
              <>
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
              </>
            </Hidden>
            <Hidden isHidden={distancePerStroke.length === 0}>
              <>
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
              </>
            </Hidden>
          </Center>
        </ViewShot>
      </ScrollView>
      <SendFab items={items} />
    </Column>
  );
}

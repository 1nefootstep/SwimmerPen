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
  Text,
  Modal,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  ComputedResult,
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
import { AnnotationInformation } from '../state/AKB';
import { NavigatorProps } from '../router';
import MultiFilePickerScreen from './MultiFilePickerScreen';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

const COLOR = '#f5f5f4';

export default function MultiResultScreen({ navigation }: NavigatorProps) {
  const [isFilePickerVisible, setIsFilePickerVisible] = useState(false);
  const [annotationBaseNames, setAnnotationBaseNames] = useState<Array<string>>(
    []
  );
  const [computedData, setComputedData] = useState<
    Array<{ name: string; result: ComputedResult }>
  >([]);
  const [isLandscape, setIsLandscape] = useState(true);

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
      setComputedData(a.map(e => ({ name: e.name, result: computeResult(e) })));
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
    icon: IconSource;
    onPress: (() => void) | (() => Promise<void>);
  }> = [
    {
      label: 'Send graph',
      icon: 'chart-line',
      onPress: takeScreenshot,
    },
  ];

  const onPressBack = navigation.goBack;
  const velocityData = computedData.map(e => ({
    name: e.name,
    stats: e.result.averageVelocities,
  }));
  const dpsData = computedData.map(e => ({
    name: e.name,
    stats: e.result.distancePerStroke,
  }));
  const lapScData = computedData.map(e => ({
    name: e.name,
    stats: e.result.lapStrokeCounts,
  }));
  const scData = computedData.map(e => ({
    name: e.name,
    stats: e.result.strokeCounts,
  }));
  const srData = computedData.map(e => ({
    name: e.name,
    stats: e.result.strokeRates,
  }));

  const onBackFromPicker = () => {
    setIsFilePickerVisible(false);
  };
  const onSelectInPicker = (baseNames: Array<string>) => {
    setAnnotationBaseNames(baseNames);
  };

  return (
    <>
      <Column flex={1} width="100%">
        <StatusBar backgroundColor={COLOR} barStyle="light-content" />
        <Box bg={COLOR} />
        <Row
          bg={COLOR}
          px="1"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          shadow="9"
          w="100%"
        >
          <Row flex={1}>
            <IconButton
              icon={<Icon size="sm" as={MaterialIcons} name="arrow-back" />}
              onPress={onPressBack}
            />
          </Row>
          <Row flex={1} justifyContent="center">
            <Text mx={4} fontSize="20" fontWeight="bold">
              Charts
            </Text>
          </Row>
          <Row flex={1} justifyContent="flex-end" mr={4}>
            <Button
              size="lg"
              variant="unstyled"
              onPress={() => {
                setIsFilePickerVisible(true);
              }}
            >
              Select annotations
            </Button>
            <Modal
              h="100%"
              size="full"
              isOpen={isFilePickerVisible}
              onClose={setIsFilePickerVisible}
            >
              <MultiFilePickerScreen
                isVisible={isFilePickerVisible}
                goBack={onBackFromPicker}
                onSelect={onSelectInPicker}
                setIsLandscape={setIsLandscape}
              />
            </Modal>
          </Row>
        </Row>
        <Hidden isHidden={!isLandscape}>
          <ScrollView flex={1} alwaysBounceVertical={true}>
            <ViewShot style={{ backgroundColor: '#fff' }} ref={viewShotRef}>
              <Center>
                <Hidden isHidden={velocityData.length === 0}>
                  <Box py={4}>
                    <VelocityChart nameAndVelocities={velocityData} />
                  </Box>
                  <Divider thickness={4} bg="muted.300" />
                </Hidden>
                <Hidden isHidden={scData.length === 0}>
                  <Box py={4}>
                    <StrokeCountChart nameAndStrokeCounts={scData} />
                  </Box>
                  <Divider thickness={4} bg="muted.300" />
                </Hidden>
                <Hidden isHidden={lapScData.length === 0}>
                  <Box py={4}>
                    <StrokeCountChart nameAndStrokeCounts={lapScData} />
                  </Box>
                  <Divider thickness={4} bg="muted.300" />
                </Hidden>
                <Hidden isHidden={srData.length === 0}>
                  <Box py={4}>
                    <StrokeRateChart nameAndStrokeRates={srData} />
                  </Box>
                  <Divider thickness={4} bg="muted.300" />
                </Hidden>
                <Hidden isHidden={dpsData.length === 0}>
                  <Box py={4}>
                    <DPSChart nameAndDps={dpsData} />
                  </Box>
                  <Divider thickness={4} bg="muted.300" />
                </Hidden>
              </Center>
            </ViewShot>
          </ScrollView>
        </Hidden>
      </Column>
      <SendFab items={items} />
    </>
  );
}

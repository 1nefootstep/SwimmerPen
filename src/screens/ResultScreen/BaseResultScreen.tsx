import React, { useLayoutEffect } from 'react';
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
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  DPSStatistic,
  StrokeCountStatistic,
  StrokeRateStatistic,
  VelocityAtRangeStatistic,
} from '../../state/StatisticsCalculator';
import VelocityChart from '../../components/result/VelocityChart';
import StrokeRateChart from '../../components/result/StrokeRateChart';
import Hidden from '../../components/Hidden';
import DPSChart from '../../components/result/DPSChart';
import SendFab from '../../components/result/SendFab';
import { RootStackParamList } from '../../router';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { DefaultTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useLayout } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  dpsDataToGeneral,
  scDataToGeneral,
  srDataToGeneral,
  velocityDataToGeneral,
} from '../../components/result/ResultUtil';
import MultiTable from '../../components/result/MultiTable';

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

interface BaseResultScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  velocityData: {
    name: string;
    stats: VelocityAtRangeStatistic[];
  }[];
  dpsData: {
    name: string;
    stats: DPSStatistic[];
  }[];
  lapScData: {
    name: string;
    stats: StrokeCountStatistic[];
  }[];
  scData: {
    name: string;
    stats: StrokeCountStatistic[];
  }[];
  srData: {
    name: string;
    stats: StrokeRateStatistic[];
  }[];
  fabItems: {
    label: string;
    icon: IconSource;
    onPress: (() => void) | (() => Promise<void>);
  }[];
  viewShotRef: React.MutableRefObject<ViewShot | null>;
  withAppbar?: boolean;
}

export default function BaseResultScreen({
  navigation,
  velocityData,
  dpsData,
  lapScData,
  scData,
  srData,
  fabItems,
  viewShotRef,
  withAppbar = true,
}: BaseResultScreenProps) {
  const { onLayout, width: w, height: h } = useLayout();

  useLayoutEffect(() => {
    (async () => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      console.log(`result screen useLayoutEffect: ${orientation}`);
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    })();
    return () => {
      ScreenOrientation.getOrientationAsync()
        .then(currOrientation => {
          console.log(`result screen destroyed: ${currOrientation}`);
          currOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
          currOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
            ? ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
              )
            : null;
        })
        .catch(err => console.error(err));
    };
  }, []);

  const isVelocityDataAvailable = velocityData[0].stats.length !== 0;
  const isScDataAvailable = scData[0].stats.length !== 0;
  const isLapScDataAvailable = lapScData[0].stats.length !== 0;
  const isDpsDataAvailable = dpsData[0].stats.length !== 0;
  const isSrDataAvailable = srData[0].stats.length !== 0;
  const paperTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: '#0891b2' },
  };
  return (
    <Box flex={1}>
      <Hidden isHidden={!withAppbar}>
        <AppBar onPressBack={() => navigation.goBack()} />
      </Hidden>
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
              <Hidden isHidden={!isVelocityDataAvailable}>
                <MultiTable
                  nameAndStats={velocityDataToGeneral(velocityData)}
                  tableName="Velocity"
                  unit={'m/s'}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isScDataAvailable}>
                <MultiTable
                  nameAndStats={scDataToGeneral(scData)}
                  tableName="Stroke Counts"
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isLapScDataAvailable}>
                <MultiTable
                  nameAndStats={scDataToGeneral(lapScData)}
                  tableName="Lap Stroke Counts"
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isSrDataAvailable}>
                <MultiTable
                  nameAndStats={srDataToGeneral(srData)}
                  tableName="Stroke rate"
                  unit={'st/min'}
                />
                <Divider thickness={4} bg="muted.300" />
              </Hidden>
              <Hidden isHidden={!isDpsDataAvailable}>
                <MultiTable
                  nameAndStats={dpsDataToGeneral(dpsData)}
                  tableName="Distance Per Stroke"
                  unit={'m/st'}
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
                  <Hidden isHidden={!isVelocityDataAvailable}>
                    <VelocityChart nameAndVelocities={velocityData} width={w} />
                    <Divider thickness={4} bg="muted.300" />
                  </Hidden>
                  <Hidden isHidden={!isSrDataAvailable}>
                    <Box py={4}>
                      <StrokeRateChart nameAndStrokeRates={srData} width={w} />
                    </Box>
                    <Divider thickness={4} bg="muted.300" />
                  </Hidden>
                  <Hidden isHidden={!isDpsDataAvailable}>
                    <Box py={4}>
                      <DPSChart nameAndDps={dpsData} width={w} />
                    </Box>
                    <Divider thickness={4} bg="muted.300" />
                  </Hidden>
                </Center>
              </ViewShot>
            </ScrollView>
            <SendFab items={fabItems} />
          </>
        </TabScreen>
      </Tabs>
    </Box>
  );
}

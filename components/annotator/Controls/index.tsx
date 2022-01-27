import React from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { Box, ScrollView } from 'native-base';
import VideoProgressBar from './VideoProgressBar';
import FineControlBar from './FineControlBar';
import SelectDistance from './Sidebar/SelectDistance';
import ToggleLineTool from './Sidebar/ToggleLineTool';
import AddTimerButton from './Sidebar/AddTimerButton';
import LoadVideo from './Sidebar/LoadVideo';
import StrokeCounter from './Sidebar/StrokeCounter';
import ToStatisticsButton from './Sidebar/ToStatisticsButton';
import FrameStepButtons from './Sidebar/FrameStepButtons';

function Spacer() {
  return <Box h={2} />;
}

export default function AnnotationControls({ navigation }) {
  const width =
    Platform.OS === 'android'
      ? Dimensions.get('screen').width - (StatusBar.currentHeight ?? 0)
      : Dimensions.get('window').width;

  const translucentOverlayRgba = `rgba(255, 255, 255, 0.30)`;
  return (
    <>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        bg={translucentOverlayRgba}
        style={{
          width: width - 164,
        }}
      >
        <VideoProgressBar />
        <Box pl={4} pr={6} pb={3}>
          <FineControlBar />
        </Box>
      </Box>

      <Box
        position="absolute"
        onLayout={({ nativeEvent }) => {
          console.log(JSON.stringify(nativeEvent.layout));
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          paddingRight: 16,
          paddingTop: 16,
          width: 164,
          height: '100%',
        }}
        bg={translucentOverlayRgba}
      >
        <ScrollView nestedScrollEnabled={true}>
          <SelectDistance />
          <Box zIndex={-5}>
            <Spacer />
            <FrameStepButtons />
            <Spacer />
            <ToggleLineTool />
            <Spacer />
            <AddTimerButton />
            <Spacer />
            <LoadVideo />
            <Spacer />
            <Spacer />
            <StrokeCounter />
            <Spacer />
            <ToStatisticsButton navigation={navigation} />
          </Box>
        </ScrollView>
      </Box>
    </>
  );
}

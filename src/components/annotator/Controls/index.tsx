import React from 'react';
import { Box, ScrollView, Row, Text } from 'native-base';
import VideoProgressBar from './VideoProgressBar';
import FineControlBar from './VideoProgressBar/FineControlBar';
import SelectDistance from './Sidebar/SelectDistance';
import ToggleLineTool from './Sidebar/ToggleLineTool';
import AddTimerButton from './Sidebar/AddTimerButton';
import LoadVideo from './Sidebar/LoadVideo';
import StrokeCounter from './Sidebar/StrokeCounter';
import ToStatisticsButton from './Sidebar/ToStatisticsButton';
import FrameStepButtons from './Sidebar/FrameStepButtons';
import { RootStackParamList } from '../../../router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TimeDisplay from './VideoProgressBar/TimeDisplay';

function Spacer() {
  return <Box h={2} />;
}

interface AnnotationControlsProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  width: number;
}

export default function AnnotationControls({
  navigation,
  width,
}: AnnotationControlsProps) {
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
        <Row alignItems="center" pb={3}>
          <Box ml={2} mr={3}>
            <TimeDisplay />
          </Box>
          <Box flex={1} mr={2}>
            <FineControlBar />
          </Box>
        </Row>
      </Box>

      <Box
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
          <LoadVideo />
          <Spacer />
          <SelectDistance />
          <Spacer />
          <FrameStepButtons />
          <Spacer />
          <ToggleLineTool />
          <Spacer />
          <AddTimerButton />
          <Spacer />
          <StrokeCounter />
          <Spacer />
          <ToStatisticsButton navigation={navigation} />
        </ScrollView>
      </Box>
    </>
  );
}

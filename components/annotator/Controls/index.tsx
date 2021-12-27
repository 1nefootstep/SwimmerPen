import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Box, Row } from 'native-base';
import VideoProgressBar from './VideoProgressBar';
import FineControlBar from './FineControlBar';
import SelectDistance from './Sidebar/SelectDistance';
import ToggleLineTool from './Sidebar/ToggleLineTool';
import AddTimerButton from './Sidebar/AddTimerButton';
import LoadVideo from './Sidebar/LoadVideo';
import StrokeCounter from './Sidebar/StrokeCounter';

function Spacer() {
  return <Box h={2} />;
}

export default function AnnotationControls() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [bottomBarHeight, setBottomBarHeight] = useState<number>(0);
  useEffect(() => {
    setHeight(Dimensions.get('window').height);
    setWidth(Dimensions.get('window').width);
  }, []);

  return (
    <>
      <Box
        position="absolute"
        bottom={0}
        mb={2}
        style={{ width: width - 48 }}
        onLayout={({ nativeEvent }) => {
          console.log(`bottomHeight: ${nativeEvent.layout.height}`);
          setBottomBarHeight(nativeEvent.layout.height);
        }}
        bg={`rgba(55, 55, 55, 0.33)`}
      >
        <VideoProgressBar />
        <FineControlBar />
      </Box>
      <Box
        position="absolute"
        top={{ sm: 4, md: 6, lg: 8 }}
        right={0}
        w={48}
        mr={2}
        bg={`rgba(55, 55, 55, 0.33)`}
        onLayout={({ nativeEvent }) => {
          console.log(`sideHeight: ${nativeEvent.layout.height}`);
        }}
        style={{ height: height - bottomBarHeight - 10 }}
      >
        <SelectDistance />
        <Box zIndex={-5}>
          <Spacer />
          <Row justifyContent='flex-end' mr={4}>
            <ToggleLineTool />
            <AddTimerButton />
          </Row>
          <Spacer />
          <LoadVideo />
          <Spacer />
          <StrokeCounter />
        </Box>
      </Box>
    </>
  );
}

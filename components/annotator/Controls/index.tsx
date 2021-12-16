import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Box, PresenceTransition } from 'native-base';
import { useAppSelector } from '../../../state/redux/hooks';
import VideoProgressBar from './VideoProgressBar';
import FineControlBar from './FineControlBar';
import { THEME_SIZE_RATIO } from '../../../constants/Constants';
import SelectDistance from './Sidebar/SelectDistance';

export default function AnnotationControls() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [bottomBarHeight, setBottomBarHeight] = useState<number>(0);

  console.log(`h:${height} w:${width}`);
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
        style={{width: width - 48}}
        onLayout={({nativeEvent}) => {
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
        top={{sm: 4, md: 6, lg: 8}}
        right={0}
        w={32}
        mr={2}
        bg={`rgba(55, 55, 55, 0.33)`}
        onLayout={({nativeEvent}) => {
          console.log(`sideHeight: ${nativeEvent.layout.height}`);
        }}
        style={{ height: height - bottomBarHeight - 10}}
      >
        <SelectDistance/>
      </Box>
    </>
  );
}

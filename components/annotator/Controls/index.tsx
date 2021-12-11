import React from 'react';
import { Box, PresenceTransition } from 'native-base';
import { useAppSelector } from '../../../state/redux/hooks';
import VideoProgressBar from './VideoProgressBar';

export default function Controls() {
  const isVisible = useAppSelector(state => state?.video.isControlVisible);

  return (
    <PresenceTransition
      visible={isVisible}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 250,
        },
      }}
    >
      <Box>
        <VideoProgressBar/>
      </Box>
    </PresenceTransition>
  );
}

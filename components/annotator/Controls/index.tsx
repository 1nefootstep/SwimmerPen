import React from 'react';
import { Box, PresenceTransition } from 'native-base';
import { useAppSelector } from '../../../state/redux/hooks';
import VideoProgressBar from './VideoProgressBar';
import VideoProgressBarTest from './VideoProgressBar_test';

export default function AnnotationControls() {
  // const isVisible = useAppSelector(state => state?.video.isControlVisible);
  const isVisible = true;

  return (
    <>
      <VideoProgressBar />
    </>
  );
}

{
  /* <PresenceTransition
visible={isVisible}
animate={{
  opacity: 1,
  transition: {
    duration: 250,
  },
}}
></PresenceTransition> */
}

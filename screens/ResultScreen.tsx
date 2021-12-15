import React, { useState, useEffect, useRef } from 'react';
import { Text, Box, Row, Center, Column, Container } from 'native-base';
import { Video } from 'expo-av';
import * as VideoService from '../state/VideoService';
import { useAppDispatch } from '../state/redux/hooks';
import { updateVideoStatus } from '../state/redux';

export default function ResultScreen({ navigation }) {
  const dispatch = useAppDispatch();

  const video = useRef<Video>(null);

  useEffect(() => {
    (() => {
      VideoService.setVideo(video);
    })();
  }, []);

  return (
    <Box flex={1}>
      <Video
        ref={video}
        useNativeControls={false}
        isLooping={false}
        resizeMode="contain"
        onPlaybackStatusUpdate={status => dispatch(updateVideoStatus(status))}
      />
    </Box>
  );
}

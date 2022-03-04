import React, { useEffect, useRef } from 'react';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as VideoService from '../../state/VideoService';
import { useAppDispatch } from '../../state/redux/hooks';
import { updateVideoStatus } from '../../state/redux';

export default function AnnotationVideo() {
  const dispatch = useAppDispatch();
  const updateStatus = (status: AVPlaybackStatus) => {
    const isLoaded = status.isLoaded;
    const positionMillis = isLoaded ? status.positionMillis : 0;
    const durationMillis =
      isLoaded && status.durationMillis !== undefined
        ? status.durationMillis
        : 0;
    const isPlaying = isLoaded && status.isPlaying;
    const uri = isLoaded ? status.uri : '';
    dispatch(
      updateVideoStatus({
        isLoaded: isLoaded,
        positionMillis: positionMillis,
        durationMillis: durationMillis,
        isPlaying: isPlaying,
        uri: uri,
      })
    );
  };

  const video = useRef<Video>(null);
  useEffect(() => {
    (() => {
      VideoService.setVideo(video);
    })();
  }, []);

  return (
    <Video
      ref={video}
      style={{ height: '100%', aspectRatio: 1.77, maxWidth: '100%' }}
      useNativeControls={false}
      isLooping={false}
      resizeMode="contain"
      onPlaybackStatusUpdate={updateStatus}
      progressUpdateIntervalMillis={500}
    />
  );
}

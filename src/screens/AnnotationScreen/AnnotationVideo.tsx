import React, { useEffect, useRef } from 'react';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as VideoService from '../../state/VideoService';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import { updateVideoStatus } from '../../state/redux';

export default function AnnotationVideo() {
  const dispatch = useAppDispatch();
  const positionMillis = useAppSelector(state => state.video.positionMillis);
  const isPlaying = useAppSelector(state => state.video.isPlaying);

  const updateStatus = (status: AVPlaybackStatus) => {
    const isLoaded = status.isLoaded;
    const isP = isLoaded && status.isPlaying;
    const p = isLoaded ? status.positionMillis : 0;
    if (isPlaying && isP && Math.abs(p - positionMillis) < 1000) {
      return;
    }
    if (isPlaying === isP && p !== 0 && p === positionMillis) {
      return;
    }
    // console.log(`update status: ${p}`);
    const durationMillis =
      isLoaded && status.durationMillis !== undefined
        ? status.durationMillis
        : 0;
    
    const uri = isLoaded ? status.uri : '';
    
    dispatch(
      updateVideoStatus({
        isLoaded: isLoaded,
        positionMillis: p,
        durationMillis: durationMillis,
        isPlaying: isP,
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
    />
  );
}

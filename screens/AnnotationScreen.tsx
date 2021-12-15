import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  Box,
  Row,
  Center,
  Column,
  Container,
  Pressable,
} from 'native-base';
import { Video, AVPlaybackStatus } from 'expo-av';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

import * as VideoService from '../state/VideoService';
import { useAppDispatch } from '../state/redux/hooks';
import { updateVideoStatus } from '../state/redux';
import AnnotationControls from '../components/annotator/Controls';
import Hidden from '../components/Hidden';
import BackButton from '../components/BackButton';

export default function AnnotationScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const updateStatus = (status: AVPlaybackStatus) => {
    dispatch(updateVideoStatus(status));
  };

  const video = useRef<Video>(null);
  const [isControlActive, setIsControlActive] = useState<boolean>(false);

  useEffect(() => {
    (() => {
      VideoService.setVideo(video);
    })();
  }, []);

  return (
    <Center flex={1} bg="black">
      <BackButton
        goBack={navigation.goBack}
        style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, margin: 12 }}
      />
      <ReactNativeZoomableView
        maxZoom={5}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={false}
        onSingleTap={() => setIsControlActive(b => !b)}
      >
        <Video
          ref={video}
          style={{ height: '100%', aspectRatio: 1.77, maxWidth: '100%' }}
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          }}
          useNativeControls={false}
          onLoad={updateStatus}
          isLooping={false}
          resizeMode="contain"
          onPlaybackStatusUpdate={updateStatus}
        />
      </ReactNativeZoomableView>
      <Hidden isHidden={!isControlActive}>
        <AnnotationControls />
      </Hidden>
    </Center>
  );
}

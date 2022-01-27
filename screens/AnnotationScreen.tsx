import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { Center } from 'native-base';
import { Video, AVPlaybackStatus } from 'expo-av';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import * as VideoService from '../state/VideoService';
import { useAppDispatch, useAppSelector } from '../state/redux/hooks';
import {
  clearControls,
  saveAnnotation,
  updateVideoStatus,
} from '../state/redux';
import AnnotationControls from '../components/annotator/Controls';
import Hidden from '../components/Hidden';
import BackButton from '../components/BackButton';
import LineTool, { LineContext } from '../components/LineTool';
import { VideoBoundContext } from '../components/VideoBoundContext';
import TimerTool from '../components/TimerTool';

export default function AnnotationScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);
  const isLoaded = videoStatus?.isLoaded ?? false;
  const updateStatus = (status: AVPlaybackStatus) => {
    dispatch(updateVideoStatus(status));
  };
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [p1X, setP1X] = useState<number>(100);
  const [p1Y, setP1Y] = useState<number>(100);
  const [p2X, setP2X] = useState<number>(150);
  const [p2Y, setP2Y] = useState<number>(150);

  const video = useRef<Video>(null);
  const [isControlActive, setIsControlActive] = useState<boolean>(true);

  useEffect(() => {
    (() => {
      VideoService.setVideo(video);
      setHeight(Dimensions.get('window').height);
      setWidth(Dimensions.get('window').width);
    })();
  }, [setHeight, setWidth]);

  return (
    <LineContext.Provider
      value={{
        p1X: p1X,
        setP1X: setP1X,
        p1Y: p1Y,
        setP1Y: setP1Y,
        p2X: p2X,
        setP2X: setP2X,
        p2Y: p2Y,
        setP2Y: setP2Y,
      }}
    >
      <VideoBoundContext.Provider
        value={{
          x1: 0,
          y1: 0,
          x2: width - 150,
          y2: height - 120,
        }}
      >
        <Center flex={1} bg="black" safeArea>
          <BackButton
            goBack={() => {
              dispatch(saveAnnotation());
              dispatch(clearControls());
              navigation.goBack();
            }}
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              margin: 12,
            }}
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
              useNativeControls={false}
              progressUpdateIntervalMillis={500}
              onLoad={updateStatus}
              isLooping={false}
              resizeMode="contain"
              onPlaybackStatusUpdate={updateStatus}
            />
          </ReactNativeZoomableView>
          <Hidden isHidden={!isLineVisible}>
            <LineTool />
          </Hidden>
          <TimerTool />
        </Center>
        <Hidden isHidden={!isControlActive}>
          <AnnotationControls navigation={navigation} />
        </Hidden>
      </VideoBoundContext.Provider>
    </LineContext.Provider>
  );
}

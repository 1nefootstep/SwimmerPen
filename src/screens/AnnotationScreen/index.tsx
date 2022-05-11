import React, { useState, useLayoutEffect } from 'react';
import { Center } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import {
  clearAnnotation,
  clearControls,
  clearVideoStatus,
  saveAnnotation,
} from '../../state/redux';
import AnnotationControls from '../../components/annotator/Controls';
import Hidden from '../../components/Hidden';
import BackButton from '../../components/BackButton';
import LineTool, { LineContext } from '../../components/LineTool';
import { VideoBoundContext } from '../../components/VideoBoundContext';
import TimerTool from '../../components/TimerTool';
import { useSharedValue } from 'react-native-reanimated';
import { NavigatorProps } from '../../router';
import AnnotationVideo from './AnnotationVideo';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { setStatusBarHidden } from 'expo-status-bar';
import { getOrientationAsync, Orientation } from 'expo-screen-orientation';
import { useLayout } from '@react-native-community/hooks';
import * as VideoService from '../../state/VideoService';
import PlayPauseAnimation from './PlayPauseAnimation';
import FrameLoadingAlert from './FrameLoadingAlert';
import AnnotationDoneAlert from './AnnotationDoneAlert';

export default function AnnotationScreen({ navigation }: NavigatorProps) {
  const dispatch = useAppDispatch();
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);
  const isLoaded = useAppSelector(state => state.video.isLoaded);
  const isPlaying = useAppSelector(state => state.video.isPlaying);
  const frames = useAppSelector(state => state.annotation.frameTimes);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const { onLayout, width: w, height: h } = useLayout();
  const pauseButtonToggle = useSharedValue(false);
  const playButtonToggle = useSharedValue(false);

  // dynamic resizing to fit any device dimensions
  useLayoutEffect(() => {
    (async () => {
      const orientation = await getOrientationAsync();
      if (
        orientation === Orientation.LANDSCAPE_RIGHT ||
        orientation === Orientation.LANDSCAPE_LEFT
      ) {
        setHeight(h);
        setWidth(w);
      } else {
        setHeight(w);
        setWidth(h);
      }
      setStatusBarHidden(true, 'slide');
    })();
  }, [h, w]);

  return (
    <LineContext.Provider
      // default or initial values of points of the line
      // these values are stored here to keep track of the line
      // position even after the line is deactivated
      value={{
        p1X: useSharedValue(100),
        p1Y: useSharedValue(100),
        p2X: useSharedValue(150),
        p2Y: useSharedValue(150),
      }}
    >
      <VideoBoundContext.Provider
        // these bounds limits the area where the points of the line
        // can be moved
        value={{
          x1: 0,
          y1: 0,
          x2: width - 120,
          y2: height - 80,
        }}
      >
        <Center flex={1} bg="black" onLayout={onLayout}>
          <FrameLoadingAlert />
          <AnnotationDoneAlert />
          <BackButton
            goBack={() => {
              // reset all settings and save the annotation when user exits annotationscreen
              dispatch(saveAnnotation());
              dispatch(clearControls());
              dispatch(clearAnnotation());
              dispatch(clearVideoStatus());
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
          <Center>
            <ReactNativeZoomableView
              maxZoom={5}
              minZoom={0.5}
              zoomStep={0.5}
              initialZoom={1}
              bindToBorders={false}
              doubleTapZoomToCenter={false}
              onSingleTap={() => {
                if (isLoaded) {
                  if (isPlaying) {
                    VideoService.pause(dispatch, frames);
                    pauseButtonToggle.value = true;
                  } else {
                    VideoService.play(dispatch);
                    playButtonToggle.value = true;
                  }
                }
              }}
            >
              <PlayPauseAnimation
                icon={
                  <MaterialIcons
                    name="pause-circle-filled"
                    size={144}
                    color="black"
                  />
                }
                progress={pauseButtonToggle}
              />
              <PlayPauseAnimation
                icon={
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={144}
                    color="black"
                  />
                }
                progress={playButtonToggle}
              />
              <AnnotationVideo />
            </ReactNativeZoomableView>
          </Center>
          <Hidden isHidden={!isLineVisible}>
            <LineTool />
          </Hidden>
          <TimerTool />
        </Center>
        <AnnotationControls navigation={navigation} width={width} />
      </VideoBoundContext.Provider>
    </LineContext.Provider>
  );
}

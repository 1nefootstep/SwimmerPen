import React, { useState, useLayoutEffect } from 'react';
import { Center } from 'native-base';
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

export default function AnnotationScreen({ navigation }: NavigatorProps) {
  const dispatch = useAppDispatch();

  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const {onLayout, width: w, height: h} = useLayout();

  useLayoutEffect(() => {
    (() => {
      getOrientationAsync().then(orientation => {
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
      });
    })();
  }, [h, w]);

  return (
    <LineContext.Provider
      value={{
        p1X: useSharedValue(100),
        p1Y: useSharedValue(100),
        p2X: useSharedValue(150),
        p2Y: useSharedValue(150),
      }}
    >
      <VideoBoundContext.Provider
        value={{
          x1: 0,
          y1: 0,
          x2: width - 120,
          y2: height - 80,
        }}
      >
        <Center flex={1} bg="black" onLayout={onLayout}>
          <BackButton
            goBack={() => {
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
          <ReactNativeZoomableView
            maxZoom={5}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={false}
          >
            <AnnotationVideo />
          </ReactNativeZoomableView>
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

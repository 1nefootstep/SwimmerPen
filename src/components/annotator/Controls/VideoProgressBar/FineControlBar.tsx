import React, { RefObject, useRef, useState } from 'react';
import { Box } from 'native-base';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  useAnimatedGestureHandler,
  runOnJS,
  runOnUI,
  useDerivedValue,
} from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';
import * as VideoService from '../../../../state/VideoService';
import { THEME_SIZE_RATIO } from '../../../../constants/Constants';
import { useLayout } from '@react-native-community/hooks';
import { AppDispatch } from '../../../../state/redux';
import { Video } from 'expo-av';
import { position } from 'native-base/lib/typescript/theme/styled-system';

export default function FineControlBar({
  dashGap = 2,
  dashLength = 6,
  dashThickness = 1 / 2,
}: {
  dashGap?: number;
  dashLength?: number;
  dashThickness?: number;
}) {
  const dispatch = useAppDispatch();
  const positionMillis = useAppSelector(state => state.video.positionMillis);

  // const [posAtStartDrag, setPosAtStartDrag] = useState<number>(0);
  const { onLayout, width } = useLayout();
  const length = width / THEME_SIZE_RATIO;
  const componentRef = useRef<Animated.View | null>(null);
  const numOfDashes = Math.ceil(length / (dashGap + dashThickness));

  const MOVEMENT_TO_FRAME_RATIO = 2;

  const displacementShared = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      marginLeft: displacementShared.value % 8,
      transform: [],
    };
  });
  const seekCallback = (toSeek: number) => {
    'worklet';
    runOnJS(VideoService.seek)(toSeek, dispatch);
  };

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
      {
        onActive: (event, ctx) => {
          displacementShared.value = event.translationX;
          const invertedTranslation = -Math.round(displacementShared.value);
          if (Math.abs(invertedTranslation) > 20) {
            const toSeek =
              positionMillis +
              Math.floor(invertedTranslation * MOVEMENT_TO_FRAME_RATIO);
            seekCallback(toSeek);
          }
        },
        onEnd: (event, ctx) => {
          displacementShared.value = withDecay({
            velocity: event.velocityX,
            deceleration: 0.9985,
          });
        },
      },
      [positionMillis]
    );

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        ref={componentRef}
        onLayout={onLayout}
        style={[
          { flexDirection: 'row', height: 25, width: '100%' },
          animatedStyles,
        ]}
      >
        {[...Array(numOfDashes)].map((_, i) => {
          return (
            <Box
              key={i}
              bg="tertiary.50"
              h={dashLength}
              w={dashThickness}
              mr={dashGap}
            />
          );
        })}
      </Animated.View>
    </PanGestureHandler>
  );
}

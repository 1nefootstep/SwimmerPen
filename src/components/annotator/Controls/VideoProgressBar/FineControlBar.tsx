import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box } from 'native-base';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../../state/redux/hooks';
import * as VideoService from '../../../../state/VideoService';
import { THEME_SIZE_RATIO } from '../../../../constants/Constants';
import { useLayout } from '@react-native-community/hooks';

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

  const [posAtStartDrag, setPosAtStartDrag] = useState<number>(0);
  // const [length, setLength] = useState<number>(0);
  const { onLayout, width } = useLayout();
  const length = width / THEME_SIZE_RATIO;
  const componentRef = useRef<Animated.View | null>(null);
  const numOfDashes = Math.ceil(length / (dashGap + dashThickness));

  const MOVEMENT_TO_FRAME_RATIO = 4;

  const displacementShared = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      marginLeft: displacementShared.value % 8,
    };
  });
  return (
    <PanGestureHandler
      onGestureEvent={({ nativeEvent }) => {
        const invertedTranslation = -Math.round(nativeEvent.translationX);
        displacementShared.value = withSpring(nativeEvent.translationX);
        const toSeek =
          posAtStartDrag +
          Math.floor(invertedTranslation * MOVEMENT_TO_FRAME_RATIO);

        VideoService.seek(toSeek >= 0 ? toSeek : 0, dispatch);
      }}
      onBegan={() => {
        setPosAtStartDrag(positionMillis);
      }}
    >
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

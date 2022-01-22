import React from 'react';
import { Box, useBreakpointValue } from 'native-base';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { RADIUS_OF_POINT } from '../../constants/Constants';

const DIAMETER_OF_POINT = RADIUS_OF_POINT * 2;

export interface PointProps {
  pX?: number;
  pY?: number;
  setX?: React.Dispatch<React.SetStateAction<number>>;
  setY?: React.Dispatch<React.SetStateAction<number>>;
  bounds: { x1: number; y1: number; x2: number; y2: number };
}

export default function Point({ pX, pY, setX, setY, bounds }: PointProps) {
  const RADIUS_OF_POINT = useBreakpointValue({
    base: 20,
    md: 24,
    lg: 32,
  });
  const DIAMETER_OF_POINT = RADIUS_OF_POINT * 2;

  const translateX = useSharedValue(
    pX !== undefined ? pX - RADIUS_OF_POINT : 0
  );
  const translateY = useSharedValue(
    pY !== undefined ? pY - RADIUS_OF_POINT : 0
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_event, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      const targetX = ctx.x + translationX;
      const targetY = ctx.y + translationY;
      if (
        targetX + DIAMETER_OF_POINT >= bounds.x2 ||
        targetX <= bounds.x1 ||
        targetY + DIAMETER_OF_POINT >= bounds.y2 ||
        targetY <= bounds.y1
      ) {
        return;
      }
      translateX.value = targetX;
      translateY.value = targetY;
      // runOnJS(setPoints)();
    },
    onEnd: () => {},
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: translateY.value,
    left: translateX.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={style}
        onLayout={() => {
          if (setX !== undefined && setY !== undefined) {
            setX(translateX.value + RADIUS_OF_POINT);
            setY(translateY.value + RADIUS_OF_POINT);
          }
        }}
      >
        <Box
          bg="transparent"
          borderWidth={2}
          borderColor="primary.200"
          h={RADIUS_OF_POINT / 2}
          w={RADIUS_OF_POINT / 2}
          borderRadius={RADIUS_OF_POINT}
        />
      </Animated.View>
    </PanGestureHandler>
  );
}

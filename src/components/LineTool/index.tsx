import React, { useContext } from 'react';
import { Box, useBreakpointValue } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';
import Hidden from '../Hidden';
import { VideoBoundContext } from '../VideoBoundContext';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LineContext } from './LineContext';

export default function LineTool() {
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);
  let { p1X, p1Y, p2X, p2Y } = useContext(LineContext);
  if (p1X === undefined || p2X === undefined || p1Y === undefined || p2Y === undefined) {
    return null;
  }
  // const p1X = useSharedValue(100);
  // const p1Y = useSharedValue(100);
  // const p2X = useSharedValue(150);
  // const p2Y = useSharedValue(150);

  const bounds = useContext(VideoBoundContext);

  const RADIUS_OF_POINT = useBreakpointValue({
    base: 20,
    md: 24,
    lg: 32,
  });
  const DIAMETER_OF_POINT = RADIUS_OF_POINT * 2;

  const onGestureEvent1 = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_event, ctx) => {
      ctx.x = p1X.value;
      ctx.y = p1Y.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      const targetX = ctx.x + translationX;
      const targetY = ctx.y + translationY;
      // bound y2 always seems to be too small, need to verify with multiple devices?
      if (
        targetX + DIAMETER_OF_POINT >= bounds.x2 ||
        targetX <= bounds.x1 ||
        targetY + DIAMETER_OF_POINT >= bounds.y2 ||
        targetY <= bounds.y1
      ) {
        return;
      }
      p1X.value = targetX;
      p1Y.value = targetY;
    },
    onEnd: () => {},
  });

  const onGestureEvent2 = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_event, ctx) => {
      ctx.x = p2X.value;
      ctx.y = p2Y.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      const targetX = ctx.x + translationX;
      const targetY = ctx.y + translationY;
      // bound y2 always seems to be too small, need to verify with multiple devices?
      if (
        targetX + DIAMETER_OF_POINT >= bounds.x2 ||
        targetX <= bounds.x1 ||
        targetY + DIAMETER_OF_POINT >= bounds.y2 ||
        targetY <= bounds.y1
      ) {
        return;
      }
      p2X.value = targetX;
      p2Y.value = targetY;
    },
    onEnd: () => {},
  });

  const pointStyle1 = useAnimatedStyle(() => ({
    position: 'absolute',
    top: p1Y.value,
    left: p1X.value,
  }));

  const pointStyle2 = useAnimatedStyle(() => ({
    position: 'absolute',
    top: p2Y.value,
    left: p2X.value,
  }));

  const lineStyle = useAnimatedStyle(() => {
    const DEG_90_IN_RAD = 1.5708;
    interface XYCoordinate {
      x: number;
      y: number;
    }
    function distanceBetweenPoints(p1: XYCoordinate, p2: XYCoordinate) {
      const a = p1.x - p2.x;
      const b = p1.y - p2.y;
      return Math.sqrt(a * a + b * b);
    }

    function angleRadOfPoints(p1: XYCoordinate, p2: XYCoordinate) {
      return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    function calcCircle(radians: number, radius: number) {
      return { x: Math.cos(radians) * radius, y: Math.sin(radians) * radius };
    }

    function calcOffset(radians: number, diameter: number) {
      const radius = diameter / 2;
      const initial = calcCircle(DEG_90_IN_RAD, radius);
      const after = calcCircle(radians + DEG_90_IN_RAD, radius);

      return { xOffset: -initial.x + after.x, yOffset: -initial.y + after.y };
    }
    const fixedP1 = { x: p1X.value, y: p1Y.value };
    const fixedP2 = { x: p2X.value, y: p2Y.value };
    const length = distanceBetweenPoints(fixedP1, fixedP2);
    const angleRad = angleRadOfPoints(fixedP1, fixedP2) - DEG_90_IN_RAD;
    const { xOffset, yOffset } = calcOffset(angleRad, length);
    const thickness = 2;
    return {
      position: 'absolute',
      left: fixedP1.x + xOffset + RADIUS_OF_POINT,
      top: fixedP1.y + yOffset + RADIUS_OF_POINT,
      height: length,
      width: thickness,
      backgroundColor: 'red',
      transform: [{ rotate: `${angleRad}rad` }],
    };
  });

  return (
    <Hidden isHidden={!isLineVisible}>
      <>
        <Animated.View style={lineStyle} />
        <PanGestureHandler onGestureEvent={onGestureEvent1}>
          <Animated.View style={pointStyle1}>
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
        <PanGestureHandler onGestureEvent={onGestureEvent2}>
          <Animated.View style={pointStyle2}>
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
      </>
    </Hidden>
  );
}
export * from './LineContext';

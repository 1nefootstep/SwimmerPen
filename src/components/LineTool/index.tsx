import React, { useMemo, useContext, useState } from 'react';
import { Button, useBreakpointValue } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';
import Hidden from '../Hidden';
import { VideoBoundContext } from '../VideoBoundContext';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LineContext } from './LineContext';
import { Vibration } from 'react-native';

export default function LineTool() {
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);
  const [fixedDrag, setFixedDrag] = useState(false);
  let { p1X, p1Y, p2X, p2Y } = useContext(LineContext);
  if (
    p1X === undefined ||
    p2X === undefined ||
    p1Y === undefined ||
    p2Y === undefined
  ) {
    return null;
  }

  const bounds = useContext(VideoBoundContext);
  const RADIUS_OF_POINT = useBreakpointValue({
    base: 20,
    md: 24,
    lg: 32,
  });
  const DIAMETER_OF_POINT = RADIUS_OF_POINT * 2;

  const onGestureEventSingle = (
    pX: SharedValue<number>,
    pY: SharedValue<number>
  ) =>
    useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      { x: number; y: number }
    >({
      onStart: (_event, ctx) => {
        ctx.x = pX.value;
        ctx.y = pY.value;
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
        pX.value = targetX;
        pY.value = targetY;
      },
      onEnd: () => {},
    });

  const onGestureEventCombined = (
    p1X: SharedValue<number>,
    p1Y: SharedValue<number>,
    p2X: SharedValue<number>,
    p2Y: SharedValue<number>
  ) =>
    useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      { x1: number; y1: number; x2: number; y2: number }
    >({
      onStart: (_event, ctx) => {
        ctx.x1 = p1X.value;
        ctx.y1 = p1Y.value;
        ctx.x2 = p2X.value;
        ctx.y2 = p2Y.value;
      },
      onActive: ({ translationX, translationY }, ctx) => {
        const targetX1 = ctx.x1 + translationX;
        const targetY1 = ctx.y1 + translationY;
        const targetX2 = ctx.x2 + translationX;
        const targetY2 = ctx.y2 + translationY;
        // bound y2 always seems to be too small, need to verify with multiple devices?
        if (
          targetX1 + DIAMETER_OF_POINT >= bounds.x2 ||
          targetX1 <= bounds.x1 ||
          targetY1 + DIAMETER_OF_POINT >= bounds.y2 ||
          targetY1 <= bounds.y1 ||
          targetX2 + DIAMETER_OF_POINT >= bounds.x2 ||
          targetX2 <= bounds.x1 ||
          targetY2 + DIAMETER_OF_POINT >= bounds.y2 ||
          targetY2 <= bounds.y1
        ) {
          return;
        }
        p1X!.value = targetX1;
        p1Y!.value = targetY1;
        p2X!.value = targetX2;
        p2Y!.value = targetY2;
      },
      onEnd: () => {},
    });

  const onGestureEvent1 = fixedDrag
    ? onGestureEventCombined(p1X, p1Y, p2X, p2Y)
    : onGestureEventSingle(p1X, p1Y);
  const onGestureEvent2 = fixedDrag
    ? onGestureEventCombined(p1X, p1Y, p2X, p2Y)
    : onGestureEventSingle(p2X, p2Y);

  const pointStyle1 = useAnimatedStyle(() => ({
    position: 'absolute',
    top: p1Y?.value ?? 0,
    left: p1X?.value ?? 0,
  }));

  const pointStyle2 = useAnimatedStyle(() => ({
    position: 'absolute',
    top: p2Y?.value ?? 0,
    left: p2X?.value ?? 0,
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
    const fixedP1 = { x: p1X?.value ?? 0, y: p1Y?.value ?? 0 };
    const fixedP2 = { x: p2X?.value ?? 0, y: p2Y?.value ?? 0 };
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
  const buttonPoint = (
    <Button
      variant="unstyled"
      h={RADIUS_OF_POINT / 2}
      w={RADIUS_OF_POINT / 2}
      bg="transparent"
      borderWidth={2}
      borderColor={fixedDrag ? 'yellow.300' : 'primary.200'}
      borderRadius={RADIUS_OF_POINT}
      // onLongPress={() => {
      //   setFixedDrag(!fixedDrag);
      //   Vibration.vibrate(100);
      // }}
    />
  );

  return (
    <Hidden isHidden={!isLineVisible}>
        <Animated.View style={lineStyle} />
        <PanGestureHandler onGestureEvent={onGestureEvent1}>
          <Animated.View style={pointStyle1}>{buttonPoint}</Animated.View>
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={onGestureEvent2}>
          <Animated.View style={pointStyle2}>{buttonPoint}</Animated.View>
        </PanGestureHandler>
    </Hidden>
  );
}
export * from './LineContext';

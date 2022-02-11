import React, { useState } from 'react';
import { Box, Button, useBreakpointValue } from 'native-base';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useAppSelector } from '../../state/redux/hooks';
import { formatTimeFromPosition } from '../../state/Util';
import DeleteTimerAlert from './DeleteTimerAlert';

export interface SingleTimerProps {
  bounds: { x1: number; y1: number; x2: number; y2: number };
  startPositionMillis: number;
}

export default function SingleTimer({
  bounds,
  startPositionMillis,
}: SingleTimerProps) {
  const translateX = useSharedValue(50);
  const translateY = useSharedValue(50);

  const { timerWidth, timerHeight } = useBreakpointValue({
    base: { timerWidth: 80, timerHeight: 32 },
    md: { timerWidth: 84, timerHeight: 36 },
    lg: { timerWidth: 90, timerHeight: 44 },
  });

  //console.log(`w: ${timerWidth} h: ${timerHeight}`);

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
        targetX + timerWidth >= bounds.x2 ||
        targetX <= bounds.x1 ||
        targetY + timerWidth >= bounds.y2 ||
        targetY <= bounds.y1
      ) {
        return;
      }
      translateX.value = targetX;
      translateY.value = targetY;
    },
    onEnd: () => {},
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: translateY.value,
    left: translateX.value,
  }));

  // const videoStatus = useAppSelector(state => state.video.status);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const positionMillis = useAppSelector(state => state.video.positionMillis);
  // const positionMillis =
  //   videoStatus !== null && videoStatus.isLoaded
  //     ? videoStatus.positionMillis
  //     : 0;

  const difference = positionMillis - startPositionMillis;
  const absoluteDifference = Math.abs(difference);
  const formatted = formatTimeFromPosition(absoluteDifference);
  const toDisplay = difference >= 0 ? '+' + formatted : '-' + formatted;

  return (
    <>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={style}>
          <Button
            style={{
              backgroundColor: '#facc15',
              borderColor: '#CA8A04',
              borderWidth: 1,
              borderRadius: 4,
              height: timerHeight,
              width: timerWidth,
            }}
            opacity={0.8}
            size="sm"
            onLongPress={() => setIsAlertOpen(true)}
          >
            {toDisplay}
          </Button>
        </Animated.View>
      </PanGestureHandler>
      <DeleteTimerAlert
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        startTime={startPositionMillis}
      />
    </>
  );
}

import React from 'react';
import { IconButton, Row } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as VideoService from '../../../../state/VideoService';
import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';
import {
  nextFrameTime,
  previousFrameTime,
} from '../../../../state/StatisticsCalculator';

interface FrameStepButtonsProps {
  stepSize?: number;
}

export default function FrameStepButtons({
  stepSize = 33,
}: FrameStepButtonsProps) {
  const dispatch = useAppDispatch();
  const frames = useAppSelector(state => state.annotation.frameTimes);
  const positionMillis = useAppSelector(state => state.video.positionMillis);

  const size = 'sm';
  const variant = 'solid';
  const spacing = 2.5;
  const colorScheme = 'amber';
  const color = 'white';

  const onPressFixed = (prevOrNext: 'prev' | 'next') => {
    if (prevOrNext === 'prev') {
      VideoService.seek(positionMillis - 1, dispatch);
    } else {
      VideoService.seek(positionMillis + 1, dispatch);
    }
  };

  const onPress = ({ isPrev }: { isPrev: boolean }) => {
    const MAX_TIME_JUMP = 1000;
    if (frames.length !== 0) {
      if (isPrev) {
        const prevTime = previousFrameTime(frames, positionMillis);
        if (
          prevTime < positionMillis &&
          positionMillis - prevTime < MAX_TIME_JUMP
        ) {
          VideoService.seek(prevTime, dispatch);
        } else {
          VideoService.seek(positionMillis - stepSize, dispatch);
        }
      } else {
        const nextTime = nextFrameTime(frames, positionMillis);
        VideoService.seek(
          nextTime > positionMillis ? nextTime : positionMillis + stepSize,
          dispatch
        );
      }
      return;
    }

    if (isPrev) {
      VideoService.seek(positionMillis - stepSize, dispatch);
    } else {
      VideoService.seek(positionMillis + stepSize, dispatch);
    }
  };

  return (
    <Row justifyContent={'center'} alignItems={'center'}>
      <IconButton
        size={size}
        color={color}
        variant={variant}
        colorScheme={colorScheme}
        mr={spacing}
        onPress={() => onPress({ isPrev: true })}
        _icon={{
          as: AntDesign,
          name: 'stepbackward',
        }}
      />
      <IconButton
        size={size}
        color={color}
        variant={variant}
        colorScheme={colorScheme}
        ml={spacing}
        onPress={() => onPress({ isPrev: false })}
        _icon={{
          as: AntDesign,
          name: 'stepforward',
        }}
      />
    </Row>
  );
}

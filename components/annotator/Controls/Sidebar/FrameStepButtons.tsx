import React from 'react';
import { IconButton, Row } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as VideoService from '../../../../state/VideoService';
import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';
import { addTimer } from '../../../../state/redux';

interface FrameStepButtonsProps {
  stepSize?: number;
}

export default function FrameStepButtons({
  stepSize = 33,
}: FrameStepButtonsProps) {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);

  const positionMillis =
    videoStatus !== null && videoStatus.isLoaded
      ? videoStatus.positionMillis
      : 0;

  const size = 'sm';
  const variant = 'solid';
  const spacing = 2.5;
  const colorScheme = 'amber';
  const color = 'white';

  return (
    <Row justifyContent={'center'} alignItems={'center'}>
      <IconButton
        size={size}
        color={color}
        variant={variant}
        colorScheme={colorScheme}
        mr={spacing}
        onPress={() => VideoService.seek(positionMillis - stepSize)}
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
        onPress={() => VideoService.seek(positionMillis + stepSize)}
        _icon={{
          as: AntDesign,
          name: 'stepforward',
        }}
      />
    </Row>
  );
}

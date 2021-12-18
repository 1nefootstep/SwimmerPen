import React from 'react';
import { Row, Button, Icon } from 'native-base';
import { Entypo } from '@expo/vector-icons';

import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';

import { addTimer, hideLine, showLine } from '../../../../state/redux';

export default function AddTimerButton() {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);

  const positionMillis = (videoStatus !== null && videoStatus.isLoaded) ? videoStatus.positionMillis : 0;

  const onPress = () => {
    dispatch(addTimer(positionMillis));
  };

  return (
    <Button
      variant="subtle"
      ml={1}
      size="sm"
      onPress={onPress}
      colorScheme="warning"
    >
      Add Timer
    </Button>
  );
}

import React from 'react';
import { Button, Center } from 'native-base';

import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';

import { addTimer } from '../../../../state/redux';

export default function AddTimerButton() {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);

  const positionMillis = (videoStatus !== null && videoStatus.isLoaded) ? videoStatus.positionMillis : 0;

  const onPress = () => {
    dispatch(addTimer(positionMillis));
  };

  return (
    <Center>
      <Button
        variant="subtle"
        w={24}
        size="sm"
        onPress={onPress}
        colorScheme="warning"
      >
        Add Timer
      </Button>
    </Center>
  );
}

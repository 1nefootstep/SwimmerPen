import React from 'react';
import { Button, Center } from 'native-base';

import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';

import { addTimer } from '../../../../state/redux';

export default function AddTimerButton() {
  const dispatch = useAppDispatch();
  const positionMillis = useAppSelector(state => state.video.positionMillis);

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

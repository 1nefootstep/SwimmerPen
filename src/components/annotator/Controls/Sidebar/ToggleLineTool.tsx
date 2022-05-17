import React from 'react';
import { Button, Icon, Center } from 'native-base';
import { Entypo } from '@expo/vector-icons';

import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';

import { hideLine, showLine } from '../../../../state/redux';

export default function ToggleLineTool() {
  const dispatch = useAppDispatch();
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);

  const onPress = () => {
    if (isLineVisible) {
      dispatch(hideLine());
    } else {
      dispatch(showLine());
    }
  };

  return (
    <Center>
      <Button
        variant="subtle"
        size="sm"
        w={24}
        onPress={onPress}
        colorScheme={isLineVisible ? 'secondary' : 'tertiary'}
        leftIcon={
          <Icon as={Entypo} name="flow-line" />
        }
      >
        Line
      </Button>
    </Center>
  );
}

import React from 'react';
import { Row, Button, Icon } from 'native-base';
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
    <Button
      variant="subtle"
      ml={1}
      size="sm"
      onPress={onPress}
      colorScheme={isLineVisible ? 'tertiary' : 'secondary'}
      leftIcon={
        <Icon as={Entypo} name="flow-line" size={{ md: 'sm', lg: 'md' }} />
      }
    >
      Line
    </Button>
  );
}
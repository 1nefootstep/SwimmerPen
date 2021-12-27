import React from 'react';
import { Column, Row, Button, Icon } from 'native-base';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatTimeFromPosition } from '../../../../../state/Util';

const ICON_SIZE = 4;

export default function SetStrokeTimeButton() {
  const onPress = () => {};
  const time = 0;
  return (
    <Column>
      
      <Row justifyContent='space-around'>
        <Button
          variant="subtle"
          size="sm"
          onPress={onPress}
          colorScheme={'primary'}
          leftIcon={
            <Icon as={MaterialCommunityIcons} name="ray-start" size={ICON_SIZE} />
          }
        >
          {formatTimeFromPosition(time)}
        </Button>
        <Button
          variant="subtle"
          size="sm"
          onPress={onPress}
          colorScheme={'primary'}
          rightIcon={
            <Icon as={MaterialCommunityIcons} name="ray-end" size={ICON_SIZE} />
          }
        >
          {formatTimeFromPosition(time)}
        </Button>
      </Row>
    </Column>
  );
}

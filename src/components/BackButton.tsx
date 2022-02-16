import React, { RefObject } from 'react';

import { IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

export default function BackButton({ goBack, style }: { goBack: any, style?:StyleProp<ViewStyle> }) {
  return (
    <IconButton
      variant="unstyled"
      onPress={goBack}
      style={style}
      _icon={{
        as: MaterialIcons,
        name: 'arrow-back',
        size: ['6', '8'],
        color: ['white'],
      }}
    />
  );
}

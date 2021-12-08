import React, { RefObject } from 'react';

import { IconButton } from 'native-base';
import { Ionicons } from '@expo/vector-icons';


export default function BackButton(props:{goBack:any}) {
  return (
    <IconButton
      variant="unstyled"
      onPress={props.goBack}
      _icon={{
        as: Ionicons,
        name: 'chevron-back-sharp',
        size: ['6', '8'],
        color: ['white'],
      }}
    />
  );
}

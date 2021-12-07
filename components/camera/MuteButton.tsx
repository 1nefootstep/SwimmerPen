import React from 'react';

import { IconButton } from 'native-base';
import {  FontAwesome } from '@expo/vector-icons';


export default function MuteButton(props: {
  isMute: boolean;
  setIsMute: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onPress = async () => {
    if (props.isMute) {
      props.setIsMute(false);
    } else {
      props.setIsMute(true);
    }
  };

  return (
    <IconButton
      variant="unstyled"
      onPress={onPress}
      _icon={{
        as: FontAwesome,
        name: props.isMute ? 'volume-off' : 'volume-up',
        size: ['8', '12'],
        color: props.isMute ? 'lime.700' : 'lime.300',
      }}
    />
  );
}

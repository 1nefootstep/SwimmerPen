import React from 'react';

import { Button, Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../state/redux/hooks';

export default function MuteButton(props: {
  isMute: boolean;
  setIsMute: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isRecording = useAppSelector((state) => state?.recording.isRecording);

  const onPress = async () => {
    if (props.isMute) {
      props.setIsMute(false);
    } else {
      props.setIsMute(true);
    }
    //console.log(isRecording);
  };

  return (
    <Button
      variant="unstyled"
      onPress={onPress}
      isDisabled={isRecording}
      leftIcon={
        <Icon
          as={FontAwesome}
          name={props.isMute ? 'volume-off' : 'volume-up'}
          size={{ sm: '12', md: '12', lg: '16' }}
          color={props.isMute ? 'lime.700' : 'lime.300'}
        />
      }
    />
  );
}

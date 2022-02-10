import React from 'react';

import { Icon, Button, useBreakpointValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { addAnnotationWhileRecording } from '../../state/redux';
import { useAppSelector } from '../../state/redux/hooks';
import { useDispatch } from 'react-redux';

export default function CheckpointButton() {
  const dispatch = useDispatch();
  const recordingInfo = useAppSelector(state => state?.recording);
  const onPress = () => {
    dispatch(addAnnotationWhileRecording(Date.now()));
  };
  const description = recordingInfo.isRecording
    ? recordingInfo.currentDistance !== 'DONE'
      ? `${recordingInfo.currentDistance}m`
      : 'DONE'
    : '0m';
  const minW = useBreakpointValue({ sm: 16, md: 20, lg: 24 });
  return (
    <Button
      leftIcon={<Icon as={Ionicons} name="checkmark" size="sm" />}
      size={{ sm: 10, md: 12, lg: 16 }}
      minW={minW}
      onPress={onPress}
      isDisabled={
        !recordingInfo.isRecording || recordingInfo.currentDistance === 'DONE'
      }
    >
      {description}
    </Button>
  );
}

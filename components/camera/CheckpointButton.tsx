import React from 'react';

import { Icon, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { addAnnotationWhileRecording } from '../../state/redux';
import { useAppSelector } from '../../state/redux/hooks';
import { useDispatch } from 'react-redux';

export default function CheckpointButton() {
  const dispatch = useDispatch();
  const recordingInfo = useAppSelector((state) => state?.recording);
  const onPress = () => {
    dispatch(addAnnotationWhileRecording());
  };

  return (
    <>
      <Button
        leftIcon={<Icon as={Ionicons} name="checkmark" size="sm" />}
        onPress={onPress}
        isDisabled={!recordingInfo.isRecording}
      >
        {recordingInfo.isRecording ? `${recordingInfo.currentDistance}m` : '0m'}
      </Button>
    </>
  );
}

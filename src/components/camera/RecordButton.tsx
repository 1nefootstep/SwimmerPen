import React from 'react';
import { IconButton } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import { saveVideoAndAnnotation, startRecording } from '../../state/redux';
import { Camera } from 'react-native-vision-camera';

export default function RecordButton({ camera }: { camera: Camera | null }) {
  const isCameraReady = camera !== null;

  const dispatch = useAppDispatch();
  const isRecording = useAppSelector(state => state.recording.isRecording);
  const onPress = () => {
    console.log(`record pressed: isCameraReady: ${isCameraReady}`);
    if (isCameraReady) {
      if (!isRecording) {
        camera!.startRecording({
          flash: 'off',
          onRecordingFinished: video => {
            dispatch(
              saveVideoAndAnnotation({ uri: video.path, stopRecording: true })
            );
          },
          onRecordingError: e => {
            console.log(`<RecordButton> error: ${e}`);
          },
        });
        dispatch(startRecording(Date.now()));
      } else {
        camera!.stopRecording();
      }
    }
  };

  return (
    <IconButton
      variant="unstyled"
      onPress={onPress}
      _icon={{
        as: Entypo,
        name: isRecording ? 'controller-stop' : 'controller-record',
        size: { sm: 20, md: 20, lg: 24 },
        color: ['rose.600'],
      }}
    />
  );
}

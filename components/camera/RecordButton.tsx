import React, { RefObject } from 'react';
import { IconButton } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { Camera, CameraRecordingOptions } from 'expo-camera';
import { useAppDispatch } from '../../state/redux/hooks';
import {
  saveVideoAndAnnotation,
  startRecording,
  stopRecording,
} from '../../state/redux';

export default function RecordButton({
  isRecording,
  setIsRecording,
  cameraRef,
  recordOptions,
}: {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  cameraRef: RefObject<Camera>;
  recordOptions?: CameraRecordingOptions;
}) {
  const camera = cameraRef.current;
  const isCameraReady = camera !== null;

  const dispatch = useAppDispatch();

  const onPress = async () => {
    if (isCameraReady) {
      if (!isRecording) {
        camera!
          .recordAsync(recordOptions)
          .then(async ({ uri }) => {
            dispatch(saveVideoAndAnnotation(uri));
          })
          .catch(e => {
            console.log(`<RecordButton> error: ${e}`);
          });
        // await camera!.takePictureAsync({ skipProcessing: true });
        dispatch(startRecording(Date.now()));
        setIsRecording(true);
      } else {
        camera!.stopRecording();
        dispatch(stopRecording());
        setIsRecording(false);
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

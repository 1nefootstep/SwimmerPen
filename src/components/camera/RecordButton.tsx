import React, { RefObject } from 'react';
import { IconButton } from 'native-base';
import { Entypo } from '@expo/vector-icons';
// import { Camera, CameraRecordingOptions } from 'expo-camera';
import { useAppDispatch } from '../../state/redux/hooks';
import {
  saveVideoAndAnnotation,
  startRecording,
  stopRecording,
} from '../../state/redux';
import { Camera } from 'react-native-vision-camera';

export default function RecordButton({
  isRecording,
  setIsRecording,
  camera,
}: // recordOptions,
{
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  camera: Camera | null;
  // recordOptions?: CameraRecordingOptions;
}) {
  // const camera = camera.current;
  const isCameraReady = camera !== null;

  const dispatch = useAppDispatch();

  const onPress = () => {
    console.log(`record pressed: isCameraReady: ${isCameraReady}`);
    if (isCameraReady) {
      if (!isRecording) {
        camera!.startRecording({
          flash: 'off',
          onRecordingFinished: video => {
            dispatch(saveVideoAndAnnotation(video.path))
          },
          onRecordingError: e => {
            console.log(`<RecordButton> error: ${e}`);
          },
        });
        // .then(async ({ uri }) => {
        //   dispatch(saveVideoAndAnnotation(uri));
        // })
        // .catch();
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

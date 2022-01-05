import React, { RefObject } from 'react';

import { IconButton } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { Camera, CameraRecordingOptions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileHandler from '../../FileHandler';

import { useAppDispatch } from '../../state/redux/hooks';
import {
  clearAnnotation,
  saveVideoAndAnnotation,
  startRecording,
  stopRecording,
} from '../../state/redux';
import { SaveVideoResult } from '../../FileHandler';

export default function RecordButton(props: {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  cameraRef: RefObject<Camera>;
  recordOptions?: CameraRecordingOptions;
}) {
  const isRecording = props.isRecording;
  const cameraRef = props.cameraRef.current;
  const isCameraReady = cameraRef !== null;

  const dispatch = useAppDispatch();

  const onPress = async () => {
    if (isCameraReady) {
      if (!isRecording) {
        let { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log(
            '<RecordButton> No permission: not allowed to write to media library'
          );
          return;
        }
        dispatch(clearAnnotation());
        cameraRef!
          .recordAsync(props.recordOptions)
          .then(async ({ uri }) => {
            // const saveVideoResult: SaveVideoResult =
            //   await FileHandler.saveVideo(uri);
            dispatch(saveVideoAndAnnotation(uri));
          })
          .catch(e => {
            console.log(`<RecordButton> error: ${e}`);
          });
        dispatch(startRecording(Date.now()));
      } else {
        cameraRef!.stopRecording();
        dispatch(stopRecording());
      }
      props.setIsRecording(b => !b);
    }
  };

  return (
    <IconButton
      variant="unstyled"
      onPress={onPress}
      _icon={{
        as: Entypo,
        name: isRecording ? 'controller-stop' : 'controller-record',
        size: { sm: '16', md: '20', lg: '24' },
        color: ['rose.600'],
      }}
    />
  );
}

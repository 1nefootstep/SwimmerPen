import React, { RefObject } from 'react';

import { IconButton } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { Camera, CameraRecordingOptions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

import { saveVideo } from '../../filesystem/FileHandler';

export default function RecordButton(props: {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  cameraRef: RefObject<Camera>;
  recordOptions?: CameraRecordingOptions;
}) {
  const isRecording = props.isRecording;
  const cameraRef = props.cameraRef.current;
  const isCameraReady = cameraRef !== null;

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

        cameraRef!
          .recordAsync(props.recordOptions)
          .then(async ({ uri }) => {
            const isSaveVideoSuccessful = await saveVideo(uri);
            console.log(`isSaveVideoSuccessful: ${isSaveVideoSuccessful}`);
            if (!isSaveVideoSuccessful) {
              props.setIsRecording(false);
            }
          })
          .catch((e) => console.log(`<RecordButton> error: ${e}`));
      } else {
        cameraRef!.stopRecording();
      }
      props.setIsRecording((b) => !b);
    }
  };

  return (
    <IconButton
      variant="unstyled"
      onPress={onPress}
      _icon={{
        as: Entypo,
        name: isRecording ? 'controller-stop' : 'controller-record',
        size: ['12', '20'],
        color: ['rose.600'],
      }}
    />
  );
}

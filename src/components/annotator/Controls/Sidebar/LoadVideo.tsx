import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Center, Modal } from 'native-base';

import * as VideoService from '../../../../state/VideoService';
import { useAppDispatch } from '../../../../state/redux/hooks';
import {
  clearControls,
  clearVideoStatus,
  loadAnnotation as reduxLoadAnnotation,
  processFrames,
  setCurrentStrokeRange,
} from '../../../../state/redux';
import * as FileHandler from '../../../../FileHandler';
import FilePickerScreen from '../../../../screens/FilePickerScreen';
import { getFrametimes } from '../../../../state/VideoProcessor';
import { getDefaultMode, getModes } from '../../../../state/AKB';

export default function LoadVideo() {
  const [isFilePickerVisible, setIsFilePickerVisible] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSelectVideo = async (uri: string) => {
    const { baseName } = FileHandler.breakUri(uri);
    const loadAnnResult = await FileHandler.loadAnnotation(baseName);
    //console.log(JSON.stringify(loadAnnResult));
    if (loadAnnResult.isSuccessful) {
      dispatch(reduxLoadAnnotation(loadAnnResult.annotation, baseName));
    }
    dispatch(clearVideoStatus());
    dispatch(clearControls());

    VideoService.loadVideo(uri).then(isSuccessful => {
      let mode = getDefaultMode();
      if (!isSuccessful) {
        //console.log('LoadVideo: load unsuccessful');
      } else {
        if (loadAnnResult.isSuccessful) {
          const toSeek = loadAnnResult.annotation.annotations[0];
          if (toSeek !== undefined) {
            VideoService.seek(toSeek, dispatch);
          }
          const { poolDistance, raceDistance } =
            loadAnnResult.annotation.poolConfig;
          if (poolDistance !== undefined && raceDistance !== undefined) {
            mode = getModes()[poolDistance][raceDistance];
          }
          const startSr = mode.strokeRanges[0].toString();
        }
      }
      const startSr = mode.strokeRanges[0].toString();
      dispatch(setCurrentStrokeRange(startSr));
    });
    dispatch(processFrames(uri));
  };

  return (
    <>
      <Modal
        style={StyleSheet.absoluteFill}
        isOpen={isFilePickerVisible}
        onClose={setIsFilePickerVisible}
      >
        <FilePickerScreen
          isVisible={isFilePickerVisible}
          setIsVisible={setIsFilePickerVisible}
          onSelect={onSelectVideo}
        />
      </Modal>
      <Center>
        <Button
          size={{ sm: 'sm', md: 'sm', lg: 'md' }}
          w={24}
          colorScheme="info"
          variant="subtle"
          onPress={() => setIsFilePickerVisible(true)}
        >
          Load Video
        </Button>
      </Center>
    </>
  );
}

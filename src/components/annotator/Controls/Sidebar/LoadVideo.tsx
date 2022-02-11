import React, { useState } from 'react';
import { Button, Center, Modal } from 'native-base';

import * as VideoService from '../../../../state/VideoService';
import { useAppDispatch } from '../../../../state/redux/hooks';
import {
  clearVideoStatus,
  loadAnnotation as reduxLoadAnnotation,
  processFrames,
} from '../../../../state/redux';
import * as FileHandler from '../../../../FileHandler';
import FilePickerScreen from '../../../../screens/FilePickerScreen';
import { getFrametimes } from '../../../../state/VideoProcessor';

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

    VideoService.loadVideo(uri).then(isSuccessful => {
      if (!isSuccessful) {
        //console.log('LoadVideo: load unsuccessful');
      } else {
        if (loadAnnResult.isSuccessful) {
          const toSeek = loadAnnResult.annotation.annotations[0];
          if (toSeek !== undefined) {
            VideoService.seek(toSeek, dispatch);
          }
        }
      }
    });
    dispatch(processFrames(uri));
  };

  return (
    <>
      <Modal
        h="100%"
        size="full"
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

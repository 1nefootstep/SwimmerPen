import React, { useEffect, useState } from 'react';
import { Button, Text } from 'native-base';

import * as VideoService from '../../../../state/VideoService';
import { useAppDispatch } from '../../../../state/redux/hooks';
import {
  clearVideoStatus,
  loadAnnotation as reduxLoadAnnotation,
} from '../../../../state/redux';
import * as FileHandler from '../../../../FileHandler';
import FilePickerScreen from '../../../../screens/FilePickerScreen';

export default function LoadVideo() {
  const [isFilePickerVisible, setIsFilePickerVisible] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSelectVideo = async (uri: string) => {
    const { baseName } = FileHandler.breakUri(uri);
    const loadAnnResult = await FileHandler.loadAnnotation(baseName);
    console.log(JSON.stringify(loadAnnResult));
    if (loadAnnResult.isSuccessful) {
      dispatch(reduxLoadAnnotation(loadAnnResult.annotation));
    }
    dispatch(clearVideoStatus());

    VideoService.loadVideo(uri).then(isSuccessful => {
      if (!isSuccessful) {
        console.log('LoadVideo: load unsuccessful');
      } else {
        if (loadAnnResult.isSuccessful) {
          const toSeek = loadAnnResult.annotation.annotations[0];
          if (toSeek !== undefined) {
            VideoService.seek(toSeek);
          }
        }
      }
    });
  };

  return (
    <>
      <FilePickerScreen
        isVisible={isFilePickerVisible}
        setIsVisible={setIsFilePickerVisible}
        onSelect={onSelectVideo}
      />
      <Button
        size={{ md: 'sm', lg: 'md' }}
        colorScheme="info"
        variant="subtle"
        onPress={() => setIsFilePickerVisible(true)}
      >
        Load Video
      </Button>
    </>
  );
}

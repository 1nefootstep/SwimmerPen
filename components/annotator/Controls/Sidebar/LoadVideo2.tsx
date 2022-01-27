import React, { useState } from 'react';
import { Button, Center } from 'native-base';

import * as VideoService from '../../../../state/VideoService';
import { useAppDispatch } from '../../../../state/redux/hooks';
import {
  clearVideoStatus,
  loadAnnotation as reduxLoadAnnotation,
} from '../../../../state/redux';
import * as FileHandler from '../../../../FileHandler';

export default function LoadVideoFilePicker() {
  const dispatch = useAppDispatch();

  const onSelectVideo = async () => {
    // const { baseName } = FileHandler.breakUri(uri);
    // const loadAnnResult = await FileHandler.loadAnnotation(baseName);
    // console.log(JSON.stringify(loadAnnResult));
    // if (loadAnnResult.isSuccessful) {
    //   dispatch(reduxLoadAnnotation(loadAnnResult.annotation));
    // }
    // dispatch(clearVideoStatus());

    // VideoService.loadVideo(uri).then(isSuccessful => {
    //   if (!isSuccessful) {
    //     console.log('LoadVideo: load unsuccessful');
    //   } else {
    //     if (loadAnnResult.isSuccessful) {
    //       const toSeek = loadAnnResult.annotation.annotations[0];
    //       if (toSeek !== undefined) {
    //         VideoService.seek(toSeek);
    //       }
    //     }
    //   }
    // });
  };

  return (
    <>
      <Center>
        <Button
          size={{ md: 'sm', lg: 'md' }}
          w={24}
          colorScheme="info"
          variant="subtle"
          onPress={onSelectVideo}
        >
          Load Video
        </Button>
      </Center>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Button, Text } from 'native-base';
import * as ImagePicker from 'expo-image-picker';

import * as VideoService from '../../../state/VideoService';
import { useAppDispatch } from '../../../state/redux/hooks';
import {
  clearVideoStatus,
  loadAnnotation as reduxLoadAnnotation,
} from '../../../state/redux';
import * as FileHandler from '../../../FileHandler';

export default function LoadVideo() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      VideoService.loadVideo(result.uri)
        .then(isSuccessful => {
          if (!isSuccessful) {
            console.log('LoadVideo: load unsuccessful');
          }
        })
        .catch(e => console.log(`LoadVideo: ${e}`));
      const { baseName } = FileHandler.breakUri(result.uri);
      const loadAnnResult = await FileHandler.loadAnnotation(baseName);
      if (loadAnnResult.isSuccessful) {
        dispatch(reduxLoadAnnotation(loadAnnResult.annotation));
      }
      dispatch(clearVideoStatus());
    }
  };

  return (
    <Button
      size={{ md: 'sm', lg: 'md' }}
      colorScheme="info"
      variant="subtle"
      onPress={pickVideo}
      isDisabled={!hasPermission}
    >
      Load Video
    </Button>
  );
}

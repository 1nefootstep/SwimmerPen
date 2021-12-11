import React, { RefObject, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { Button, Text } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { loadVideo } from '../../../state/VideoService';
import { Video } from 'expo-av';
import { useAppDispatch } from '../../../state/redux/hooks';
import { clearVideoStatus } from '../../../state/redux';

export default function LoadVideo(props: { videoRef: RefObject<Video> }) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const canLoadVideo = hasPermission && props.videoRef.current !== null;

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      loadVideo(result.uri)
        .then(isSuccessful => {
          if (!isSuccessful) {
            console.log('LoadVideo: load unsuccessful');
          }
        })
        .catch(e => console.log(`LoadVideo: ${e}`));
      dispatch(clearVideoStatus());
    }
  };

  return (
    <Button
      w={{ sm: 8, md: 12, lg: 16 }}
      variant="unstyled"
      onPress={pickImage}
      isDisabled={!canLoadVideo}
    >
      <Text fontSize={{ sm: 8, md: 10, lg: 12 }}>Load Video</Text>
    </Button>
  );
}

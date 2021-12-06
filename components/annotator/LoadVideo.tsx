import React, { RefObject } from 'react';

import { IconButton } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { getAppDir } from '../../filesystem/FileHandler';

export default function LoadVideo() {
  const pickVideo = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   quality: 1,
    // });

    // console.log(result);
    const albumRef = await MediaLibrary.getAlbumAsync('SwimmerPen');
    const assets = await MediaLibrary.getAssetsAsync({album: albumRef, mediaType: ['video']});
    console.log(assets.assets.map((e, i)=>e.filename));
  };

  return (
    <IconButton
      variant="unstyled"
      onPress={pickVideo}
      _icon={{
        as: Entypo,
        name: 'game-controller',
        size: ['12', '20'],
        color: ['rose.600'],
      }}
    />
  );
}

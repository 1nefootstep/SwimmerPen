import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Heading,
  Spinner,
  Row,
  Center,
  Text,
  Box,
  Column,
  FlatList,
  Image,
} from 'native-base';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import * as FS from 'expo-file-system';

import { breakUri, getVideoNames, getVideoUri } from '../FileHandler';
import { Dimensions, Platform, StatusBar } from 'react-native';

interface FilePickerScreenProps {
  onSelect: (uri: string) => Promise<void>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilePickerScreen({
  onSelect,
  isVisible,
  setIsVisible,
}: FilePickerScreenProps) {
  const [videoUris, setVideoUris] = useState<Array<string>>([]);
  const [thumbnailUris, setThumbnailUris] = useState<Array<ImageSource>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const width =
    Platform.OS === 'android'
      ? Dimensions.get('screen').width - (StatusBar.currentHeight ?? 0)
      : Dimensions.get('window').width;

  useEffect(() => {
    const updateVideoUris = () => {
      setIsLoading(true);
      getVideoNames().then(async names => {
        //console.log(`video names: ${names}`);
        const urisAndModificationTime = await Promise.all(
          names.map(async e => {
            const { baseName } = breakUri(e);
            const uri = getVideoUri(baseName);
            const result = await FS.getInfoAsync(uri);
            if (result.exists) {
              return { uri: uri, modTime: result.modificationTime };
            } else {
              return { uri: uri, modTime: 0 };
            }
          })
        );

        const uris = urisAndModificationTime
          .filter(e => e.modTime !== 0)
          .sort((a, b) => b.modTime - a.modTime)
          .map(e => e.uri);
        setVideoUris(uris);
        let thumbnailResults: Array<VideoThumbnails.VideoThumbnailsResult> = [];
        try {
          thumbnailResults = await Promise.all(
            uris.map(async (e, i) => await VideoThumbnails.getThumbnailAsync(e))
          );
        } catch (err) {
          console.log(`filepicker: ${err}`);
        }
        const imageSources = thumbnailResults.map((e, i) => {
          return { uri: e.uri };
        });

        setThumbnailUris(imageSources);
        setIsLoading(false);
      });
    };
    ScreenOrientation.getOrientationAsync()
      .then(currOrientation => {
        currOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        currOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT
            )
          : null;
      })
      .catch(err => console.error(err));
    if (isVisible) {
      updateVideoUris();
    }
    return () => {
      ScreenOrientation.getOrientationAsync()
        .then(currOrientation => {
          currOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
          currOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
            ? ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
              )
            : null;
        })
        .catch(err => console.error(err));
    };
  }, [isVisible]);

  const getNameFromUri = (uri: string) => {
    const { baseName } = breakUri(uri);
    return baseName;
  };

  const Card = ({
    item: { videoUri, idx },
  }: {
    item: { videoUri: string; idx: number };
  }) => (
    <Box m="auto">
      <Row space={3} justifyContent="space-between">
        <Column>
          <TouchableOpacity
            onPress={() => {
              onSelect(videoUris[idx]);
              setIsVisible(false);
            }}
          >
            <Image
              source={thumbnailUris[idx]}
              alt={idx.toString()}
              h={200}
              w={width / 2}
            />
          </TouchableOpacity>
          <Text
            color="coolGray.600"
            _dark={{
              color: 'warmGray.200',
            }}
          >
            {getNameFromUri(videoUri)}
          </Text>
        </Column>
      </Row>
    </Box>
  );
  return (
    <Column flex={1} mx="auto" w="100%" bg="gray.400">
      {isLoading ? (
        <Center h='100%'>
          <Spinner color="secondary.500" size="lg" accessibilityLabel="Loading" />
        </Center>
      ) : (
        <FlatList
          data={videoUris.map((e, i) => {
            return { videoUri: e, idx: i };
          })}
          renderItem={Card}
          numColumns={2}
          keyExtractor={item => item.videoUri}
        />
      )}
    </Column>
  );
}

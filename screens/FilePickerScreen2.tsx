import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Heading,
  Spinner,
  Row,
  Button,
  Text,
  Box,
  Column,
  Divider,
  Spacer,
  FlatList,
  Modal,
  Image,
} from 'native-base';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import * as FS from 'expo-file-system';

import {
  breakUri,
  deleteVideoandAnnotation,
  getVideoNames,
  getVideoUri,
} from '../FileHandler';
import { Dimensions, Platform, StatusBar } from 'react-native';

interface FilePickerScreenProps {
  onSelect: (uri: string) => Promise<void>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilePickerScreen2({
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
  const updateVideoUris = () => {
    setIsLoading(true);
    getVideoNames().then(async names => {
      console.log(`video names: ${names}`);
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
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (isVisible) {
      updateVideoUris();
    }
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
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
    <Box pl="4" pr="5" py="2" style={{ maxWidth: width / 2 }}>
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

  // const footer = ({ imageIndex }: { imageIndex: number }) => (
  //   <Column alignItems="center" justifyContent="center">
  //     <Box
  //       bg="primary.50"
  //       paddingX={8}
  //       paddingY={2}
  //       mb={2}
  //       alignItems="center"
  //       justifyContent="center"
  //     >
  //       <Text>{getNameFromUri(videoUris[imageIndex] ?? '')}</Text>
  //     </Box>
  //     <Row>
  //       <Button
  //         variant="solid"
  //         size="sm"
  //         mr={4}
  //         onPress={() => {
  //           onSelect(videoUris[imageIndex]);
  //           setIsVisible(false);
  //         }}
  //         colorScheme="tertiary"
  //       >
  //         Select
  //       </Button>
  //       <Button
  //         variant="solid"
  //         size="sm"
  //         onPress={async () => {
  //           const { baseName } = breakUri(videoUris[imageIndex]);
  //           console.log(`uri: ${videoUris[imageIndex]}, basename: ${baseName}`);
  //           await deleteVideoandAnnotation(baseName);
  //           updateVideoUris();
  //         }}
  //         colorScheme="tertiary"
  //       >
  //         Delete
  //       </Button>
  //     </Row>
  //   </Column>
  // );
  if (isLoading) {
    return (
      <Row space={2} alignItems="center">
        <Spinner accessibilityLabel="Loading posts" />
        <Heading color="primary.500" fontSize="md">
          Loading
        </Heading>
      </Row>
    );
  }
  return (
    <Column flex={1} alignItems="center" w="100%" bg="gray.400">
      <FlatList
        data={videoUris.map((e, i) => {
          return { videoUri: e, idx: i };
        })}
        renderItem={Card}
        numColumns={2}
        keyExtractor={item => item.videoUri}
      />
    </Column>
  );
}

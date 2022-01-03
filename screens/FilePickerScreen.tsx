import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  Icon,
  Box,
  Row,
  Center,
  Column,
  Container,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import {
  breakUri,
  deleteVideoandAnnotation,
  getVideoNames,
  getVideoUri,
} from '../FileHandler';

export default function FilePickerScreen({
  onSelect,
  isVisible,
  setIsVisible,
}) {
  const [videoUris, setVideoUris] = useState<Array<string>>([]);
  const [thumbnailUris, setThumbnailUris] = useState<Array<ImageSource>>([]);

  const updateVideoUris = () => {
    getVideoNames().then(async names => {
      console.log(`video names: ${names}`);
      const uris = names
        .sort()
        .reverse()
        .map((e, i) => {
          const { baseName } = breakUri(e);
          const uri = getVideoUri(baseName);
          console.log(uri);
          return getVideoUri(baseName);
        });
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
      setVideoUris(uris);
      setThumbnailUris(imageSources);
    });
  };

  useEffect(() => {
    updateVideoUris();
  }, []);

  const getNameFromUri = (uri: string) => {
    const { baseName } = breakUri(uri);
    return baseName;
  };

  const footer = ({ imageIndex }: { imageIndex: number }) => (
    <Column alignItems="center" justifyContent="center">
      <Box
        bg="primary.50"
        paddingX={8}
        paddingY={2}
        mb={2}
        alignItems="center"
        justifyContent="center"
      >
        <Text>{getNameFromUri(videoUris[imageIndex] ?? '')}</Text>
      </Box>
      <Button
        variant="solid"
        size="sm"
        mr={4}
        onPress={() => {
          onSelect(videoUris[imageIndex]);
          setIsVisible(false);
        }}
        colorScheme="tertiary"
      >
        Select
      </Button>
      <Button
        variant="solid"
        size="sm"
        onPress={async () => {
          const { baseName } = breakUri(videoUris[imageIndex]);
          console.log(`uri: ${videoUris[imageIndex]}, basename: ${baseName}`);
          await deleteVideoandAnnotation(baseName);
          updateVideoUris();
        }}
        colorScheme="tertiary"
      >
        Delete
      </Button>
    </Column>
  );

  return (
    <ImageView
      images={thumbnailUris}
      imageIndex={0}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      FooterComponent={footer}
    />
  );
}

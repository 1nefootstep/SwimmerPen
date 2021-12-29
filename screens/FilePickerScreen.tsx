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
import { breakUri, getVideoNames, getVideoUri } from '../FileHandler';

export default function FilePickerScreen({
  onSelect,
  isVisible,
  setIsVisible,
}) {
  const [videoUris, setVideoUris] = useState<Array<string>>([]);
  const [thumbnailUris, setThumbnailUris] = useState<Array<ImageSource>>([]);

  useEffect(() => {
    getVideoNames().then(async names => {
      const uris = names
        .sort()
        .reverse()
        .map((e, i) => getVideoUri(e));
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
        onPress={() => {
          onSelect(videoUris[imageIndex]);
          setIsVisible(false);
        }}
        colorScheme="tertiary"
      >
        Select
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

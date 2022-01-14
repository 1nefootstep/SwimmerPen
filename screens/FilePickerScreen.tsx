import React, { useEffect, useState } from 'react';
import { Heading, Spinner, Row, Button, Text, Box, Column } from 'native-base';
import * as VideoThumbnails from 'expo-video-thumbnails';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import * as FS from 'expo-file-system';

import {
  breakUri,
  deleteVideoandAnnotation,
  getVideoNames,
  getVideoUri,
} from '../FileHandler';

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
    setIsLoading(false);
  };

  useEffect(() => {
    if (isVisible) {
      updateVideoUris();
    }
  }, [isVisible]);

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
    <ImageView
      images={thumbnailUris}
      imageIndex={0}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      FooterComponent={footer}
    />
  );
}

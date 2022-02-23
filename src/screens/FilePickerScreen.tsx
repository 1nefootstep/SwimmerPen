import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Icon,
  Spinner,
  Row,
  Center,
  Text,
  Button,
  Box,
  Column,
  FlatList,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import * as FS from 'expo-file-system';
import {
  breakUri,
  getVideoNames,
  getVideoUri,
  importVideoAndAnnotation,
} from '../FileHandler';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { default as FilePickerCard } from '../components/filepicker/Card';

function AppBar({
  onPressBack,
  onImport,
}: {
  onPressBack: () => void;
  onImport: () => void;
}) {
  const COLOR = '#f5f5f4';
  return (
    <>
      <StatusBar backgroundColor={COLOR} barStyle="light-content" />
      <Box safeAreaTop bg={COLOR} />
      <Row
        bg={COLOR}
        px="1"
        py="3"
        justifyContent="space-between"
        shadow="9"
        w="100%"
      >
        <Row alignItems="center">
          <IconButton
            icon={<Icon size="sm" as={MaterialIcons} name="arrow-back" />}
            onPress={onPressBack}
          />
          <Text mx={4} fontSize="20" fontWeight="bold">
            Video Picker
          </Text>
        </Row>
        <Row mr={4}>
          <Button
            size="lg"
            variant="unstyled"
            onPress={() => {
              importVideoAndAnnotation()
                .then(isSuccessful => {
                  console.log(isSuccessful);
                  if (isSuccessful) {
                    onImport();
                  }
                })
                .catch(err => console.error(`importing video error: ${err}`));
            }}
          >
            Import
          </Button>
        </Row>
      </Row>
    </>
  );
}

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

  const updateVideoUris = () => {
    setIsLoading(true);
    getVideoNames().then(async names => {
      Promise.all(
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
      ).then(urisAndModificationTime => {
        const uris = urisAndModificationTime
          .filter(e => e.modTime !== 0)
          .sort((a, b) => b.modTime - a.modTime)
          .map(e => e.uri);
        setVideoUris(uris);
        Promise.all(
          uris.map(async (e, i) => await VideoThumbnails.getThumbnailAsync(e))
        )
          .then(thumbnailResults => {
            const imageSources = thumbnailResults.map((e, i) => {
              return { uri: e.uri };
            });

            setThumbnailUris(imageSources);
            setIsLoading(false);
          })
          .catch(err => console.log(`filepicker: ${err}`));
      });
    });
  };

  useEffect(() => {
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

  const onPressCard = (videoUri: string) => {
    onSelect(videoUri);
    setIsVisible(false);
  };

  const onDeleteUpdate = () => {
    updateVideoUris();
  };

  return (
    <Column flex={1} mx="auto" w="100%" bg="gray.400">
      <AppBar
        onPressBack={() => setIsVisible(false)}
        onImport={() => updateVideoUris()}
      />
      {isLoading ? (
        <Center h="100%">
          <Spinner
            color="secondary.500"
            size="lg"
            accessibilityLabel="Loading"
          />
        </Center>
      ) : (
        <FlatList
          data={videoUris.map((e, i) => {
            return { videoUri: e, thumbnailUri: thumbnailUris[i] };
          })}
          renderItem={e => (
            <FilePickerCard
              key={e.item.videoUri}
              videoUri={e.item.videoUri}
              thumbnailUri={e.item.thumbnailUri}
              width={width}
              onPress={onPressCard}
              onDeleteUpdate={onDeleteUpdate}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 12 }}
          keyExtractor={item => item.videoUri}
        />
      )}
    </Column>
  );
}

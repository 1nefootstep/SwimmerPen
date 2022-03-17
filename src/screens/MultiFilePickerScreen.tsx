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
  CloseIcon,
  CheckIcon,
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
import { default as FilePickerCard } from '../components/filepicker/MultiCard';

function AppBar({
  onPressBack,
  onImport,
  selections,
  onReset,
  onDone,
}: {
  onPressBack: () => void;
  onImport: () => void;
  selections: Array<string>;
  onReset: () => void;
  onDone: (selections: Array<string>) => void;
}) {
  const COLOR = '#f5f5f4';
  const hasSelection = selections.length > 0;
  return (
    <>
      <StatusBar backgroundColor={COLOR} barStyle="light-content" />
      <Box bg={COLOR} />
      <Row
        bg={COLOR}
        px="1"
        py="3"
        justifyContent="space-between"
        shadow="9"
        w="100%"
      >
        <Row alignItems="center">
          {hasSelection ? (
            <IconButton icon={<CloseIcon size="sm" />} onPress={onReset} />
          ) : (
            <IconButton
              icon={<Icon size="sm" as={MaterialIcons} name="arrow-back" />}
              onPress={onPressBack}
            />
          )}
        </Row>
        <Row>
          {hasSelection ? (
            <Text mx={4} fontSize="12">{`${selections.length} selected.`}</Text>
          ) : (
            <Text mx={4} fontSize="20" fontWeight="bold">
              Video Picker
            </Text>
          )}
        </Row>
        <Row mr={4}>
          {hasSelection ? (
            <IconButton
              icon={<CheckIcon size="sm" />}
              onPress={() => {
                onDone(selections);
                onPressBack();
              }}
            />
          ) : (
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
          )}
        </Row>
      </Row>
    </>
  );
}

export interface MultiFilePickerScreenProps {
  // onSelect: React.Dispatch<React.SetStateAction<string[]>>;
  isVisible: boolean;
  // setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  goBack: () => void;
  onSelect: (baseNames: string[]) => void;
  // setIsLandscape: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MultiFilePickerScreen({
  onSelect,
  isVisible,
  goBack,
  // setIsLandscape,
}: MultiFilePickerScreenProps) {
  const [videoUris, setVideoUris] = useState<Array<string>>([]);
  const [thumbnailUris, setThumbnailUris] = useState<Array<ImageSource>>([]);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    // ScreenOrientation.getOrientationAsync()
    //   .then(currOrientation => {
    //     currOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    //     currOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    //       ? ScreenOrientation.lockAsync(
    //           ScreenOrientation.OrientationLock.PORTRAIT
    //         )
    //       : null;
    //     setIsLandscape(false);
    //   })
    //   .catch(err => console.error(err));
    if (isVisible) {
      updateVideoUris();
    }
    // return () => {
    //   ScreenOrientation.getOrientationAsync()
    //     .then(currOrientation => {
    //       currOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
    //       currOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    //         ? ScreenOrientation.lockAsync(
    //             ScreenOrientation.OrientationLock.LANDSCAPE
    //           )
    //         : null;
    //       setIsLandscape(true);
    //     })
    //     .catch(err => console.error(err));
    // };
  }, [isVisible]);

  const onPressCard = (baseName: string) => {
    if (isMultiSelecting) {
      if (selected.includes(baseName)) {
        setSelected(prev => prev.filter(e => e !== baseName));
      } else {
        setSelected(prev => prev.concat(baseName));
      }
    } else {
      onSelect([baseName]);
      goBack();
    }
  };

  const onDeleteUpdate = () => {
    updateVideoUris();
  };

  const onLongPress = (baseName: string) => {
    if (isMultiSelecting) {
      setIsMultiSelecting(false);
      setSelected([]);
    } else {
      setIsMultiSelecting(true);
      setSelected([baseName]);
    }
  };

  const onPressConfirm = (selection: Array<string>) => {
    if (selection.length !== 0) {
      onSelect(selection);
      goBack();
    }
  };

  return (
    <Column flex={1} mx="auto" w="100%" bg="gray.400">
      <AppBar
        onPressBack={goBack}
        onImport={() => updateVideoUris()}
        selections={selected}
        onReset={() => setSelected([])}
        onDone={onPressConfirm}
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
          renderItem={e => {
            const { baseName } = breakUri(e.item.videoUri);
            return (
              <FilePickerCard
                key={e.item.videoUri}
                videoUri={e.item.videoUri}
                thumbnailUri={e.item.thumbnailUri}
                width={width}
                onPress={onPressCard}
                onDeleteUpdate={onDeleteUpdate}
                onLongPress={onLongPress}
                isSelected={selected.includes(baseName)}
              />
            );
          }}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 12 }}
          keyExtractor={item => item.videoUri}
        />
      )}
    </Column>
  );
}

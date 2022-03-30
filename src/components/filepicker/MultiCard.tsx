import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Vibration } from 'react-native';
import {
  Text,
  Box,
  Image,
  Menu,
  Pressable,
  Row,
  Icon,
  CheckCircleIcon,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import { breakUri, deleteVideoAndAnnotation } from '../../FileHandler';
import DeleteVideoModal from './DeleteVideoModal';
import EditNameModal from './EditNameModal';
import { shortenText } from '../../state/Util';

function getNameFromUri(uri: string) {
  const { baseName } = breakUri(uri);
  return baseName;
}

interface MultiCardProps {
  videoUri: string;
  thumbnailUri: ImageSource;
  width: number;
  onLongPress?: (baseName: string) => void;
  onPress: (baseName: string) => void;
  onDeleteUpdate: () => void;
  isSelected?: boolean;
}

export default function MultiCard({
  videoUri,
  thumbnailUri,
  width,
  onPress,
  onDeleteUpdate,
  onLongPress,
  isSelected,
}: MultiCardProps) {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    setName(getNameFromUri(videoUri));
  }, []);

  const deleteConfirmation = (confirmDelete: boolean) => {
    if (confirmDelete) {
      deleteVideoAndAnnotation(name);
      onDeleteUpdate();
    }
    setDeleteModalOpen(false);
  };

  const onPossibleNameChange = (newName?: string) => {
    if (newName !== undefined) {
      setName(newName);
    }
    setEditModalOpen(false);
  };

  return (
    <Box m="auto" py={4}>
      <TouchableOpacity
        onPress={() => onPress(name)}
        onLongPress={() => {
          if (onLongPress !== undefined) {
            onLongPress(name);
            Vibration.vibrate(300);
          }
        }}
        delayLongPress={250}
      >
        <Box h={200} w={width / 2 - 16}>
          <Image
            source={thumbnailUri}
            alt="video-thumbnail"
            h="100%"
            w="100%"
          />
          <Box
            w={6}
            h={6}
            borderRadius={12}
            bg={isSelected ? 'white' : `rgba(255,255,255, 0.3)`}
            position="absolute"
            bottom={3}
            right={3}
          >
            {isSelected ? (
              <CheckCircleIcon
                color="#03a9f4"
                style={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                }}
              />
            ) : null}
          </Box>
        </Box>
      </TouchableOpacity>
      <Row justifyContent="space-between">
        <Text
          color="coolGray.600"
          _dark={{
            color: 'warmGray.200',
          }}
        >
          {shortenText(name, 8)}
        </Text>
        <Menu
          trigger={triggerProps => {
            return (
              <Pressable accessibilityLabel="options" {...triggerProps}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="dots-vertical"
                  color="coolGray.800"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  size="sm"
                />
              </Pressable>
            );
          }}
        >
          <Menu.Item onPress={() => setEditModalOpen(true)}>Edit</Menu.Item>
          <Menu.Item onPress={() => setDeleteModalOpen(true)}>Delete</Menu.Item>
        </Menu>
      </Row>
      <EditNameModal
        isOpen={editModalOpen}
        onClose={onPossibleNameChange}
        name={name}
      />
      <DeleteVideoModal
        isOpen={deleteModalOpen}
        onClose={deleteConfirmation}
        name={name}
      />
    </Box>
  );
}

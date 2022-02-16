import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, Box, Image, Menu, Pressable, Row, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import { breakUri, deleteVideoAndAnnotation } from '../../FileHandler';
import DeleteVideoModal from './DeleteVideoModal';
import EditNameModal from './EditNameModal';

interface CardProps {
  videoUri: string;
  thumbnailUri: ImageSource;
  width: number;
  onPress: (videoUri: string) => void;
  onDeleteUpdate: () => void;
}

function getNameFromUri(uri: string) {
  const { baseName } = breakUri(uri);
  return baseName;
}

export default function Card({
  videoUri,
  thumbnailUri,
  width,
  onPress,
  onDeleteUpdate,
}: CardProps) {
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
      <TouchableOpacity onPress={() => onPress(videoUri)}>
        <Image
          source={thumbnailUri}
          alt="video-thumbnail"
          h={200}
          w={width / 2 - 16}
        />
      </TouchableOpacity>
      <Row justifyContent="space-between">
        <Text
          color="coolGray.600"
          _dark={{
            color: 'warmGray.200',
          }}
        >
          {name}
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

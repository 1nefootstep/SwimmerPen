import React, { useState } from 'react';
import {
  Modal,
  FormControl,
  Input,
  Button,
  WarningOutlineIcon,
  Spinner,
} from 'native-base';
import { renameVideoAndAnnotation } from '../../FileHandler';
import Hidden from '../Hidden';

const INVALID_CHARS = ['|', '\\', '/', '?', '*', '<', '"', "'", ':', '>'];

export interface EditNameModalProps {
  isOpen: boolean;
  onClose: (newName?: string) => void;
  name: string;
}

export default function EditNameModal({
  isOpen,
  onClose,
  name,
}: EditNameModalProps) {
  const [newName, setNewName] = useState<string>('');
  const [invalidText, setInvalidText] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const checkValidity = (n: string) => {
    return INVALID_CHARS.map(e => !newName.includes(e)).every(Boolean);
  };

  const onSave = async () => {
    const isValid = checkValidity(newName);
    setIsInvalid(isValid);
    if (isValid) {
      setIsSaving(true);
      renameVideoAndAnnotation(name, newName).then(isSuccessful => {
        if (isSuccessful) {
          setIsSaving(false);
          onClose(newName);
        } else {
          setIsSaving(false);
          setIsInvalid(true);
          setInvalidText(`Error with saving.`);
        }
      });
    } else {
      setInvalidText(
        `Cannot contain invalid chars such as: ${INVALID_CHARS.join(', ')}.`
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{`Renaming ${name}`}</Modal.Header>
        <Modal.Body>
          {isSaving ? (
            <Spinner size="lg" />
          ) : (
            <FormControl>
              <FormControl.Label>New Name</FormControl.Label>
              <Input value={newName} onChangeText={e => setNewName(e)} />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
                isInvalid={isInvalid}
              >
                {invalidText}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        </Modal.Body>
        <Hidden isHidden={isSaving}>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => onClose()}
              >
                Cancel
              </Button>
              <Button onPress={onSave}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Hidden>
      </Modal.Content>
    </Modal>
  );
}

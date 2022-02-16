import React, { useRef } from 'react';
import { AlertDialog, Button } from 'native-base';

export interface DeleteVideoModalProps {
  isOpen: boolean;
  onClose: (confirmDelete: boolean) => void;
  name: string;
}

export default function DeleteVideoModal({
  isOpen,
  onClose,
  name,
}: DeleteVideoModalProps) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={() => onClose(false)}
    >
      <AlertDialog.Content w={48}>
        <AlertDialog.Header alignItems="center">
          {`Confirm deletion of ${name}`}
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={() => onClose(false)}
              ref={cancelRef}
            >
              Cancel
            </Button>
            <Button colorScheme="danger" onPress={() => onClose(true)}>
              Delete
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

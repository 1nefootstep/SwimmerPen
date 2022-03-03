import React, { useRef } from 'react';
import { AlertDialog, Button } from 'native-base';
import { useAppDispatch } from '../../state/redux/hooks';
import { removeTimer } from '../../state/redux';

const WIDTH_TIMER = 80;
const HEIGHT_TIMER = 24;

export interface DeleteTimerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

export default function SingleTimer({
  isOpen,
  setIsOpen,
  id,
}: DeleteTimerProps) {
  const dispatch = useAppDispatch();

  const cancelRef = useRef(null);
  const onClose = () => setIsOpen(false);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialog.Content w={48}>
        <AlertDialog.Header alignItems="center">
          Delete this Timer?
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}
            >
              Cancel
            </Button>
            <Button
              colorScheme="danger"
              onPress={() => {
                onClose();
                dispatch(removeTimer(id));
              }}
            >
              Delete
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

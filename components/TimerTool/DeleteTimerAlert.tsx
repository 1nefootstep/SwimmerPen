import React, { useRef } from 'react';
import { AlertDialog, Box, Button } from 'native-base';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { THEME_SIZE_RATIO } from '../../constants/Constants';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import { formatTimeFromPosition } from '../../state/Util';
import { removeTimer } from '../../state/redux';

const WIDTH_TIMER = 80;
const HEIGHT_TIMER = 24;

export interface DeleteTimerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startTime: number;
}

export default function SingleTimer({
  isOpen,
  setIsOpen,
  startTime,
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
          Delete this timer?
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
                dispatch(removeTimer(startTime));
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

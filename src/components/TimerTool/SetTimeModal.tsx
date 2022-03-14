import React, { useRef, useState } from 'react';
import {
  Button,
  Center,
  FormControl,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  WarningOutlineIcon,
} from 'native-base';
import { useAppDispatch } from '../../state/redux/hooks';
import { editTimerStartTime } from '../../state/redux';

export interface SetTimeModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  positionMillis: number;
}

const onlyNumberRegex = new RegExp('^\\d+$');

export default function SetTimeModal({
  isOpen,
  setIsOpen,
  id,
  positionMillis,
}: SetTimeModalProps) {
  const dispatch = useAppDispatch();
  const [currInput, setCurrInput] = useState('');
  const [time, setTime] = useState<number | undefined>(undefined);
  const [isInvalid, setIsInvalid] = useState(false);
  const handleChange = (text: string) => {
    const num = Number(text);
    if (isNaN(num)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      setTime(num * 1000);
    }
    setCurrInput(text);
  };

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth={200}>
          <Modal.CloseButton />
          <Modal.Header>Set Time</Modal.Header>
          <Modal.Body>
            <FormControl isInvalid={isInvalid}>
              <InputGroup>
                <Input
                  keyboardType="decimal-pad"
                  value={currInput}
                  onChangeText={handleChange}
                  w={120}
                />
                <InputRightAddon children={'s'} />
              </InputGroup>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Enter time in seconds.
              </FormControl.ErrorMessage>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  if (time !== undefined) {
                    const startTimeToSet = positionMillis - time;
                    dispatch(editTimerStartTime(id, startTimeToSet));
                  }
                  setIsOpen(false);
                }}
                disabled={isInvalid}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}

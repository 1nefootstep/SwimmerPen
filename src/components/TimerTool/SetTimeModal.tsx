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
  const [time, setTime] = useState<number | undefined>(undefined);
  const [isInvalid, setIsInvalid] = useState(true);
  const handleChange = (text: string) => {
    if (onlyNumberRegex.test(text)) {
      setIsInvalid(false);
      setTime(parseInt(text));
    } else {
      setIsInvalid(true);
    }
  };

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth={200}>
          <Modal.CloseButton />
          <Modal.Header>Set Timer's time</Modal.Header>
          <Modal.Body>
            <FormControl isInvalid={isInvalid}>
              <InputGroup>
                <Input
                  value={time?.toFixed()}
                  onChangeText={handleChange}
                  w={100}
                />
                <InputRightAddon children={'ms'} />
              </InputGroup>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Only enter numbers.
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

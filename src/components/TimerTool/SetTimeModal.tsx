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
  Text,
  Row,
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
  const [currInputMin, setCurrInputMin] = useState('');
  const [currInputSec, setCurrInputSec] = useState('');
  const [currInputMs, setCurrInputMs] = useState('');
  const [time, setTime] = useState<number | undefined>(undefined);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChangeMin = (text: string) => {
    const numMin = Number(text);
    const numSec = Number(currInputSec);
    const numMs = Number(currInputMs);
    if (isNaN(numMin) || isNaN(numSec) || isNaN(numMs)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      setTime(numMin * 60000 + numSec * 1000 + numMs);
    }
    setCurrInputMin(text);
  };

  // consider adding checks to make sure 0<= sec < 60
  const handleChangeSec = (text: string) => {
    const numMin = Number(currInputMin);
    const numSec = Number(text);
    const numMs = Number(currInputMs);
    if (isNaN(numMin) || isNaN(numSec) || isNaN(numMs)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      setTime(numMin * 60000 + numSec * 1000 + numMs);
    }
    setCurrInputSec(text);
  };

  // consider adding checks to make sure 0<= sec < 1000
  const handleChangeMs = (text: string) => {
    const numMin = Number(currInputMin);
    const numSec = Number(currInputSec);
    const numMs = Number(text);
    if (isNaN(numMin) || isNaN(numSec) || isNaN(numMs)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      setTime(numMin * 60000 + numSec * 1000 + numMs);
    }
    setCurrInputMs(text);
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
                <Row alignItems="center" maxH={40}>
                  <Input
                    keyboardType="number-pad"
                    value={currInputMin}
                    onChangeText={handleChangeMin}
                    w={45}
                  />
                  <Text> : </Text>
                  <Input
                    keyboardType="number-pad"
                    value={currInputSec}
                    onChangeText={handleChangeSec}
                    w={45}
                  />
                  <Text> . </Text>
                  <Input
                    keyboardType="number-pad"
                    value={currInputMs}
                    onChangeText={handleChangeMs}
                    w={45}
                  />
                </Row>
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

import React, { useState } from 'react';

import { Button, Modal, Column, Radio, Box, Text } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';

interface SelectResolutionProps {
  resolutions: Array<string>;
  setVideoQuality: React.Dispatch<React.SetStateAction<string>>;
}

export default function SelectResolution(props: SelectResolutionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quality, setQuality] = useState<string>(props.resolutions[0]);
  const isRecording = useAppSelector((state) => state?.recording.isRecording);
  return (
    <>
      <Box flex={1} justifyContent="center">
        <Button w={[12,16,20,32,40]} variant="subtle" isDisabled={isRecording} onPress={() => setShowModal(true)}>
          <Text fontSize={[6,8,10,14,18]}>{quality}p</Text>
        </Button>
      </Box>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Resolution</Modal.Header>
          <Modal.Body>
            <Radio.Group
              defaultValue="0"
              name="videoQuality"
              size="sm"
              onChange={(quality: string) => {
                setQuality(quality);
              }}
            >
              <Column space={3}>
                {Array.from(props.resolutions).map((e, i) => {
                  return (
                    <Radio
                      key={i}
                      alignItems="flex-start"
                      _text={{
                        mt: '-1',
                        ml: '2',
                        fontSize: 'sm',
                      }}
                      value={e}
                    >
                      {e + 'p'}
                    </Radio>
                  );
                })}
              </Column>
            </Radio.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal(false);
                props.setVideoQuality(quality);
              }}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

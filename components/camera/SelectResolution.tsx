import React, { useState, useEffect } from 'react';

import { Button, Modal, Column, Radio, Box, Text } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';

interface SelectResolutionProps {
  currentResolution: '480p' | '720p' | '1080p' | '2160p';
  resolutions: Array<'480p' | '720p' | '1080p' | '2160p'>;
  setVideoQuality: React.Dispatch<
    React.SetStateAction<'480p' | '720p' | '1080p' | '2160p'>
  >;
}

export default function SelectResolution({
  currentResolution,
  resolutions,
  setVideoQuality,
}: SelectResolutionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quality, setQuality] = useState<'480p' | '720p' | '1080p' | '2160p'>(
    '720p'
  );
  const isRecording = useAppSelector(state => state?.recording.isRecording);

  useEffect(() => {
    setQuality(currentResolution);
  }, [setQuality]);

  return (
    <>
      <Box flex={1} justifyContent="center">
        <Button
          w={[12, 16, 20, 32, 40]}
          variant="subtle"
          isDisabled={isRecording}
          onPress={() => setShowModal(true)}
        >
          <Text fontSize={[6, 8, 10, 14, 18]}>{quality}</Text>
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
                if (
                  quality !== '480p' &&
                  quality !== '720p' &&
                  quality !== '1080p' &&
                  quality !== '2160p'
                ) {
                  return;
                }
                setQuality(quality);
              }}
            >
              <Column space={3}>
                {Array.from(resolutions).map((e, i) => {
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
                      {e}
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
                setVideoQuality(quality);
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

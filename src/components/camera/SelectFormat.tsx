import React, { useState, useEffect } from 'react';

import { Button, Modal, Column, Radio, Box, Text } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';
import { CameraDeviceFormat, FrameRateRange } from 'react-native-vision-camera';
import { getMaxFps } from '../../state/Util';

function mergeFrameRates(ranges: FrameRateRange[]): FrameRateRange[] {
  const copy = ranges.map(e => ({
    minFrameRate: e.minFrameRate,
    maxFrameRate: e.maxFrameRate,
  }));
  copy.sort(function (a, b) {
    return a.minFrameRate - b.minFrameRate || a.maxFrameRate - b.maxFrameRate;
  });
  const result: FrameRateRange[] = [];
  let last: FrameRateRange | null = null;

  copy.forEach(r => {
    if (!last || r.minFrameRate > last.maxFrameRate) result.push((last = r));
    else if (r.maxFrameRate > last.maxFrameRate)
      last.maxFrameRate = r.maxFrameRate;
  });
  return result;
}

interface SelectFormatProps {
  format?: CameraDeviceFormat;
  formats: CameraDeviceFormat[];
  onChangeFormat: (format?: CameraDeviceFormat) => void;
}

interface FormatDescription {
  resolution: { height: number; width: number };
  frameRateRanges: FrameRateRange[];
}

export default function SelectFormat({
  formats,
  onChangeFormat,
  format,
}: SelectFormatProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] =
    useState<CameraDeviceFormat | null>(null);
  const [formatDescriptions, setFormatDescriptions] = useState<
    FormatDescription[]
  >([]);

  const isRecording = useAppSelector(state => state?.recording.isRecording);

  useEffect(() => {
    if (showModal) {
      setSelectedFormat(format ?? null);
    }
  }, [showModal, format]);

  useEffect(() => {
    const descriptions: FormatDescription[] = formats.map(e => {
      return {
        resolution: { height: e.videoHeight, width: e.videoWidth },
        frameRateRanges: mergeFrameRates(e.frameRateRanges),
      };
    });
    setFormatDescriptions(descriptions);
  }, [formats]);

  const defaultValue = formats.findIndex(e => e === format);

  return (
    <>
      <Box flex={1} justifyContent="center">
        <Button
          w={[12, 16, 20, 32, 40]}
          variant="subtle"
          isDisabled={isRecording}
          onPress={() => setShowModal(true)}
        >
          <Text fontSize={[6, 8, 10, 14, 18]}>
            {format !== undefined
              ? `${format.videoWidth}x${format.videoHeight} ${getMaxFps(
                  format
                )}fps`
              : 'Resolution'}
          </Text>
        </Button>
      </Box>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Resolution and FPS</Modal.Header>
          <Modal.Body>
            <Radio.Group
              defaultValue={defaultValue >= 0 ? defaultValue.toString() : '0'}
              name="videoQuality"
              size="sm"
              onChange={(descriptionIndex: string) => {
                setSelectedFormat(formats[Number(descriptionIndex)]);
              }}
            >
              <Column space={3}>
                {formatDescriptions.map((e, i) => {
                  return (
                    <Radio
                      key={JSON.stringify(e.resolution)}
                      alignItems="flex-start"
                      _text={{
                        mt: '-1',
                        ml: '2',
                        fontSize: 'sm',
                      }}
                      value={i.toString()}
                    >
                      {`${e.resolution.width}x${
                        e.resolution.height
                      } - fps: ${e.frameRateRanges
                        .map(e => `${e.minFrameRate}-${e.maxFrameRate}`)
                        .join(', ')}`}
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
                onChangeFormat(selectedFormat ?? formats[0]);
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

import React, { useState, useEffect } from 'react';

import { Button, Modal, Column, Radio, Box, Text } from 'native-base';

import {
  Modes,
  getModes,
  PoolDistance,
  poolDistanceToNumber,
  numberToPoolDistance,
  getDefaultMode,
} from '../state/AKB/AnnotationKnowledgeBank';
import { ModeState } from '../state/redux/reducers/mode.reducer';
import { updateMode, AppDispatch } from '../state/redux';
import { useAppDispatch, useAppSelector } from '../state/redux/hooks';

export default function SelectMode() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state?.mode);

  const [modes, setModes] = useState<Modes | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [poolDistance, setPoolDistance] = useState<PoolDistance>(
    PoolDistance.D50m
  );
  const [modeIndex, setModeIndex] = useState<number>(0);

  useEffect(() => {
    (() => {
      const modes: Modes = getModes();
      setModes(modes);
      setPoolDistance(mode.poolDistance);
    })();
  }, []);

  if (modes === null) {
    return <></>;
  }

  const modeToModeName = (mode: ModeState): string => {
    const fallbackMode = getDefaultMode();
    if (modes !== null) {
      const possibleRaceDists = modes.get(mode.poolDistance);
      if (possibleRaceDists === undefined) {
        return fallbackMode.name;
      }
      const selectedMode = possibleRaceDists[mode.modeIndex];
      if (selectedMode === undefined) {
        return fallbackMode.name;
      }
      return selectedMode.name;
    }
    return fallbackMode.name;
  };

  return (
    <>
      <Box flex={1} justifyContent="center">
        <Button
          w={[12, 16, 20, 32, 40]}
          variant="subtle"
          onPress={() => setShowModal(true)}
        >
          <Text fontSize={[6, 8, 10, 14, 18]}>{modeToModeName(mode)}</Text>
        </Button>
      </Box>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Pool Length</Modal.Header>
          <Modal.Body>
            <Radio.Group
              defaultValue="50"
              name="poolDistance"
              size="sm"
              onChange={(pd: string) => {
                let pdInNum = parseInt(pd);
                if (pdInNum === NaN) {
                  pdInNum = 50;
                }
                setPoolDistance(numberToPoolDistance(pdInNum));
              }}
            >
              <Column space={3}>
                {Array.from(modes.keys()).map((e, i) => {
                  const poolLengthInStr = poolDistanceToNumber(e).toString();
                  return (
                    <Radio
                      key={i}
                      alignItems="flex-start"
                      _text={{
                        mt: '-1',
                        ml: '2',
                        fontSize: 'sm',
                      }}
                      value={poolLengthInStr}
                    >
                      {poolLengthInStr}m
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
                setShowModal2(true);
              }}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModal2} onClose={() => setShowModal2(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Race Distance</Modal.Header>
          <Modal.Body>
            <Radio.Group
              defaultValue="0"
              name="raceDistance"
              size="sm"
              onChange={(mi: string) => {
                let miInNum = parseInt(mi);
                if (miInNum === NaN) {
                  miInNum = 0;
                }
                setModeIndex(miInNum);
              }}
            >
              <Column space={3}>
                {Array.from(modes.get(poolDistance) ?? []).map((e, i) => {
                  return (
                    <Radio
                      key={i}
                      alignItems="flex-start"
                      _text={{
                        mt: '-1',
                        ml: '2',
                        fontSize: 'sm',
                      }}
                      value={i.toString()}
                    >
                      {e.name}
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
                setShowModal2(false);
                dispatch(updateMode(poolDistance, modeIndex));
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

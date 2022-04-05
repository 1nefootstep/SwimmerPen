import React, { useEffect, useMemo, useState } from 'react';
import { Row, Button, Icon, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';
import {
  addAnnotation,
  saveAnnotation,
  setCurrentDistance,
  showAnnotationDoneAlert,
} from '../../../../state/redux';
import * as VideoService from '../../../../state/VideoService';
import {
  annotationIsDone,
  getDefaultMode,
  getModes,
  Modes,
} from '../../../../state/AKB';
import { getPosition } from '../../../../state/VideoService';

export default function SelectDistance() {
  const dispatch = useAppDispatch();
  const annotationInfo = useAppSelector(state => state.annotation);
  const annotations = annotationInfo.annotations;
  const { poolDistance, raceDistance } = useAppSelector(
    state => state.annotation.poolConfig
  );
  const currentDistance = useAppSelector(
    state => state.controls.currentDistance
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [modes, setModes] = useState<Modes | null>(null);
  useEffect(() => {
    (() => {
      const modes: Modes = getModes();
      setModes(modes);
    })();
  }, []);

  const mode =
    modes !== null ? modes[poolDistance][raceDistance] : getDefaultMode();

  const items = useMemo(
    () =>
      mode.checkpoints.map((e, i) => {
        return { label: e.name, value: e.distanceMeter };
      }),
    [mode]
  );

  const movePositionToDistance = (distance: number) => {
    VideoService.seek(annotations[distance], dispatch);
  };

  const onPressCheckpoint = async () => {
    const posResult = await getPosition();
    if (posResult.isSuccessful) {
      dispatch(addAnnotation(currentDistance, posResult.positionMillis));
      const currIndex = mode.checkpoints.findIndex(
        cp => cp.distanceMeter === currentDistance
      );
      const nextIndex =
        currIndex + 1 > mode.checkpoints.length - 1 ? currIndex : currIndex + 1;
      const isLastCheckpoint =
        mode.checkpoints[mode.checkpoints.length - 1].distanceMeter ===
          mode.checkpoints[currIndex].distanceMeter || 
          currIndex === nextIndex;
          
      const d = mode.checkpoints[nextIndex].distanceMeter;
      dispatch(setCurrentDistance(d));
      const toSeek = annotations[d];
      if (toSeek !== undefined) {
        VideoService.seek(toSeek);
      }
      dispatch(saveAnnotation());

      if (isLastCheckpoint) {
        if (annotationIsDone({ mode: mode, annotationInfo: annotationInfo })) {
          dispatch(showAnnotationDoneAlert());
        }
      }
    }
  };

  return (
    <Row alignItems="center" justifyContent="flex-end" mr={4}>
      <Box maxH={10} maxW={24} mt={1} mr={1}>
        <DropDownPicker
          items={items}
          style={{ maxHeight: 36, width: 86 }}
          textStyle={{
            fontSize: 10,
            flex: 3,
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{ nestedScrollEnabled: true }}
          arrowIconContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          arrowIconStyle={{ height: 14, width: 14 }}
          placeholder={`${currentDistance}m`}
          value={currentDistance}
          dropDownContainerStyle={{
            maxHeight: 148,
            zIndex: 20,
            elevation: 999,
          }}
          open={isOpen}
          setOpen={b => {
            setIsOpen(b);
          }}
          setValue={value => dispatch(setCurrentDistance(value()))}
          onSelectItem={({ label, value }) => {
            movePositionToDistance(value as number);
          }}
          autoScroll={true}
        />
      </Box>
      <Button
        variant="solid"
        mr={1}
        size="sm"
        w={8}
        h={8}
        onPress={onPressCheckpoint}
        leftIcon={<Icon as={Ionicons} name="checkmark" size="sm" />}
      />
    </Row>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Row, Factory, Button, Icon, Column, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';

import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';

import { addAnnotation, setCurrentDistance } from '../../../../state/redux';
import * as VideoService from '../../../../state/VideoService';
import { getDefaultMode, getModes, Modes } from '../../../../state/AKB';
import { maxHeight, zIndex } from 'styled-system';

// const FactoryDropDown = Factory(DropDownPicker);

export default function SelectDistance() {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);
  const annotations = useAppSelector(state => state.annotation.annotations);

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
    [poolDistance, raceDistance]
  );

  // const items = [{label: '0m', value: 0}];

  const onChangeValue = (newValue: ValueType | ValueType[] | null) => {
    if (videoStatus === null || !videoStatus.isLoaded) {
      return;
    }

    let distance: number;
    if (newValue === null) {
      distance = 0;
    } else if (typeof newValue === 'number') {
      distance = newValue as number;
    } else {
      distance = 0;
    }
    VideoService.seek(annotations[distance]);
  };

  const onPressCheckpoint = () => {
    if (videoStatus !== null && videoStatus.isLoaded) {
      dispatch(addAnnotation(currentDistance, videoStatus.positionMillis));
      const currIndex = mode.checkpoints.findIndex(
        cp => cp.distanceMeter === currentDistance
      );
      const nextIndex =
        currIndex + 1 > mode.checkpoints.length - 1 ? currIndex : currIndex + 1;

      const d = mode.checkpoints[nextIndex].distanceMeter;
      dispatch(setCurrentDistance(d));
      const toSeek = annotations[d];
      if (toSeek !== undefined) {
        VideoService.seek(toSeek);
      }
    }
  };

  return (
    <Row alignItems='center' justifyContent='flex-end' mr={4}>
      <Box
        maxH={10}
        maxW={24}
        mt={1}
        mr={1}
      >
      <DropDownPicker
        items={items}
        style={{maxHeight: 36, width: 86}}
        textStyle={{fontSize: 12}}
        placeholder={`${currentDistance}m`}
        value={currentDistance}
        dropDownContainerStyle={{zIndex: 20, elevation: 999}}
        open={isOpen}
        setOpen={b => {
          if (videoStatus !== null && videoStatus.isLoaded) {
            setIsOpen(b);
          }
        }}
        setValue={value => dispatch(setCurrentDistance(value()))}
        autoScroll={true}
        onChangeValue={onChangeValue}
      />
      </Box>
      <Button
        variant="solid"
        mr={1}
        size='sm'
        w={8}
        h={8}
        onPress={onPressCheckpoint}
        isDisabled={videoStatus === null || !videoStatus.isLoaded}
        leftIcon={
          <Icon as={Ionicons} name="checkmark" size='sm' />
        }
      />
    </Row>
  );
}

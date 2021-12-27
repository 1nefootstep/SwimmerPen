import React, { useEffect, useMemo, useState } from 'react';
import { Row, Factory, Button, Icon, Column, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';

import { useAppDispatch, useAppSelector } from '../../../../../state/redux/hooks';

import { maxHeight, zIndex } from 'styled-system';

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

  const onChangeValue = () => {};

  const onPressCheckpoint = () => {};

  return (
    <Row alignItems='center' justifyContent='flex-end' mr={4}>
      <Box
        maxH={10}
        maxW={24}
        mr={1}
      >
      <DropDownPicker
        items={items}
        style={{maxHeight: 42}}
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
        ml={1}
        size='sm'
        w={10}
        h={10}
        onPress={onPressCheckpoint}
        isDisabled={videoStatus === null || !videoStatus.isLoaded}
        leftIcon={
          <Icon as={Ionicons} name="checkmark" size='sm' />
        }
      />
    </Row>
  );
}

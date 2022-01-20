import React, { useEffect, useMemo, useState } from 'react';
import { Row, Box } from 'native-base';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../state/redux/hooks';

import { setCurrentStrokeRange } from '../../../../../state/redux';
import { getDefaultMode, getModes, Modes } from '../../../../../state/AKB';

export default function SelectStrokeRange() {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);

  const { poolDistance, raceDistance } = useAppSelector(
    state => state.annotation.poolConfig
  );
  const currentSr = useAppSelector(state => state.controls.currentSr);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modes, setModes] = useState<Modes | null>(null);

  const mode =
    modes !== null ? modes[poolDistance][raceDistance] : getDefaultMode();

  const items = useMemo(
    () =>
      mode.strokeRanges.map(e => {
        const label = e.toString();
        return { label: label, value: label };
      }),
    [poolDistance, raceDistance]
  );

  useEffect(() => {
    (() => {
      const modes: Modes = getModes();
      setModes(modes);
      if (currentSr === '') {
        dispatch(setCurrentStrokeRange(items[0].value));
      }
    })();
  }, []);

  const onChangeValue = (newValue: ValueType | ValueType[] | null) => {
    if (videoStatus === null || !videoStatus.isLoaded) {
      return;
    }

    let sr: string;
    if (newValue === null) {
      sr = '';
    } else if (typeof newValue === 'string') {
      sr = newValue as string;
    } else {
      sr = '';
    }
    dispatch(setCurrentStrokeRange(sr));
  };

  return (
    <Row justifyContent="center" alignItems="center">
      <Box maxW={32} mr={1}>
        <DropDownPicker
          items={items}
          min={0}
          max={3}
          placeholder={items[0].value}
          style={{ maxHeight: 40, width: 126 }}
          textStyle={{ fontSize: 12 }}
          value={currentSr}
          listMode="SCROLLVIEW"
          scrollViewProps={{ nestedScrollEnabled: true }}
          dropDownContainerStyle={{
            maxHeight: 100,
            zIndex: 20,
            elevation: 999,
          }}
          open={isOpen}
          setOpen={b => {
            if (videoStatus !== null && videoStatus.isLoaded) {
              setIsOpen(b);
            }
          }}
          setValue={value => dispatch(setCurrentStrokeRange(value()))}
          autoScroll={true}
          onChangeValue={onChangeValue}
        />
      </Box>
    </Row>
  );
}

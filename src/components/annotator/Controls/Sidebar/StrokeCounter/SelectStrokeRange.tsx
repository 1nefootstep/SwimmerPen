import React, { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Row, Box, Button, Icon } from 'native-base';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../state/redux/hooks';
import { setCurrentStrokeRange } from '../../../../../state/redux';
import { getDefaultMode, getModes, Modes } from '../../../../../state/AKB';
import * as VideoService from '../../../../../state/VideoService';

export default function SelectStrokeRange() {
  const dispatch = useAppDispatch();

  const { poolDistance, raceDistance } = useAppSelector(
    state => state.annotation.poolConfig
  );
  const currentSr = useAppSelector(state => state.controls.currentSr);
  const strokeCounts = useAppSelector(state => state.annotation.strokeCounts);

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
    [poolDistance, raceDistance, modes]
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

  const seekToStartTime = (newValue: ValueType | ValueType[] | null) => {
    let s: string;
    if (newValue === null) {
      s = '';
    } else if (typeof newValue === 'string') {
      s = newValue as string;
    } else {
      s = '';
    }
    const scWithTime =
      s in strokeCounts
        ? strokeCounts[s]
        : { strokeCount: 0, startTime: 0, endTime: 0 };
    if (scWithTime.startTime !== 0) {
      VideoService.seek(scWithTime.startTime, dispatch);
    }
  };

  const setSr = (sr: string) => {
    dispatch(setCurrentStrokeRange(sr));
    seekToStartTime(sr);
  };

  return (
    <Row alignItems="center" justifyContent="flex-end" mb={2} mr={4}>
      <Box maxH={8} maxW={24} mb={1} mr={1} flex={1}>
        <DropDownPicker
          items={items}
          min={0}
          max={3}
          placeholder={items[0].value}
          style={{ maxHeight: 36, width: 86 }}
          textStyle={{ fontSize: 8, flex: 5 }}
          value={currentSr}
          listMode="SCROLLVIEW"
          scrollViewProps={{ nestedScrollEnabled: true }}
          arrowIconContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          arrowIconStyle={{ height: 10, width: 10 }}
          dropDownContainerStyle={{
            maxHeight: 100,
            zIndex: 20,
            elevation: 999,
          }}
          open={isOpen}
          setOpen={b => {
            setIsOpen(b);
          }}
          setValue={value => {
            const sr = value() ?? value;
            setSr(sr);
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
        onPress={() => {
          const currIndex = mode.strokeRanges.findIndex(
            e => e.toString() === currentSr
          );
          if (currIndex !== -1 && currIndex !== mode.strokeRanges.length - 1) {
            const nextSr = mode.strokeRanges[currIndex + 1];
            setSr(nextSr.toString());
          }
        }}
        leftIcon={<Icon as={Ionicons} name="checkmark" size="sm" />}
      />
    </Row>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Row, Box } from 'native-base';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../state/redux/hooks';
import { setCurrentStrokeRange } from '../../../../../state/redux';
import {
  getDefaultMode,
  getModes,
  Modes,
  StrokeRange,
} from '../../../../../state/AKB';
import * as VideoService from '../../../../../state/VideoService';

export default function SelectStrokeRange() {
  const dispatch = useAppDispatch();
  const videoStatus = useAppSelector(state => state.video.status);

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
    if (videoStatus === null || !videoStatus.isLoaded) {
      return;
    }

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
      VideoService.seek(scWithTime.startTime);
    }
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
          setValue={value => {
            const sr = value() ?? value;
            dispatch(setCurrentStrokeRange(sr));
            seekToStartTime(sr);
          }}
          autoScroll={true}
        />
      </Box>
    </Row>
  );
}

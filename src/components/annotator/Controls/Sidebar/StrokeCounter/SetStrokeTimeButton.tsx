import React, { useEffect, useState } from 'react';
import { Column, Row, Button } from 'native-base';

import { formatTimeFromPosition } from '../../../../../state/Util';
import { useAppSelector } from '../../../../../state/redux/hooks';
import { useDispatch } from 'react-redux';
import { addStrokeCount, saveAnnotation } from '../../../../../state/redux';
import {
  getDefaultMode,
  getModes,
  Modes,
  StrokeRange,
} from '../../../../../state/AKB';
import Hidden from '../../../../Hidden';
import { getPosition } from '../../../../../state/VideoService';

export default function SetStrokeTimeButton() {
  const dispatch = useDispatch();
  const currentSr = useAppSelector(state => state.controls.currentSr);
  const strokeCounts = useAppSelector(state => state.annotation.strokeCounts);
  const scWithTime =
    currentSr in strokeCounts
      ? strokeCounts[currentSr]
      : { strokeCount: 0, startTime: 0, endTime: 0 };
  const [modes, setModes] = useState<Modes | null>(null);
  const sr = StrokeRange.fromString(currentSr);
  const { poolDistance, raceDistance } = useAppSelector(
    state => state.annotation.poolConfig
  );
  const mode =
    modes !== null ? modes[poolDistance][raceDistance] : getDefaultMode();

  useEffect(() => {
    const modes: Modes = getModes();
    setModes(modes);
  }, []);

  const onPressLeft = async (sr: StrokeRange) => {
    if (currentSr === '') {
      return;
    }
    const posResult = await getPosition();
    if (posResult.isSuccessful) {
      dispatch(
        addStrokeCount(
          sr.startRange,
          sr.endRange,
          posResult.positionMillis,
          scWithTime.endTime,
          scWithTime.strokeCount
        )
      );
      dispatch(saveAnnotation());
    }
  };

  const onPressRight = async (sr: StrokeRange) => {
    if (currentSr === '') {
      return;
    }
    const posResult = await getPosition();
    if (posResult.isSuccessful) {
      dispatch(
        addStrokeCount(
          sr.startRange,
          sr.endRange,
          scWithTime.startTime,
          posResult.positionMillis,
          scWithTime.strokeCount
        )
      );
      const nextSrIndexStartEndRangeSame = mode.strokeRanges.findIndex(
        e => e.startRange === sr.endRange
      );
      if (nextSrIndexStartEndRangeSame !== -1) {
        const nextSr = mode.strokeRanges[nextSrIndexStartEndRangeSame];
        const nextScWithTime = strokeCounts[nextSr.toString()];
        if (nextScWithTime === undefined || nextScWithTime.startTime === 0) {
          dispatch(
            addStrokeCount(
              nextSr.startRange,
              nextSr.endRange,
              posResult.positionMillis,
              nextScWithTime?.endTime ?? 0,
              nextScWithTime?.strokeCount ?? 0
            )
          );
        }
      }
      dispatch(saveAnnotation());
    }
  };
  const isLapStroke = sr.endRange - sr.startRange >= 25;
  return (
    <Hidden isHidden={isLapStroke}>
      <Column>
        <Row justifyContent="space-around">
          <Button
            variant="subtle"
            size="sm"
            onPress={() => {
              onPressLeft(sr);
            }}
            colorScheme={'primary'}
          >
            {'Start:'}
            {formatTimeFromPosition(scWithTime.startTime)}
          </Button>
          <Button
            variant="subtle"
            size="sm"
            onPress={() => onPressRight(sr)}
            colorScheme={'primary'}
          >
            {'End:'}
            {formatTimeFromPosition(scWithTime.endTime)}
          </Button>
        </Row>
      </Column>
    </Hidden>
  );
}

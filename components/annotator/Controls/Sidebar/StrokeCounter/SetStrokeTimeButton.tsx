import React from 'react';
import { Column, Row, Button, Icon } from 'native-base';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatTimeFromPosition } from '../../../../../state/Util';
import { useAppSelector } from '../../../../../state/redux/hooks';
import { useDispatch } from 'react-redux';
import { addStrokeCount } from '../../../../../state/redux';
import { StrokeRange } from '../../../../../state/AKB';

const ICON_SIZE = 4;

export default function SetStrokeTimeButton() {
  const dispatch = useDispatch();
  const currentSr = useAppSelector(state => state.controls.currentSr);
  const strokeCounts = useAppSelector(state => state.annotation.strokeCounts);
  const videoStatus = useAppSelector(state => state.video.status);
  const positionMillis =
    videoStatus !== null && videoStatus.isLoaded
      ? videoStatus.positionMillis
      : 0;
  const scWithTime =
    currentSr in strokeCounts
      ? strokeCounts[currentSr]
      : { strokeCount: 0, startTime: 0, endTime: 0 };

  const onPressLeft = () => {
    if (currentSr === '') {
      return;
    }
    const sr = StrokeRange.fromString(currentSr);
    dispatch(
      addStrokeCount(
        sr.startRange,
        sr.endRange,
        positionMillis,
        scWithTime.endTime,
        scWithTime.strokeCount
      )
    );
  };

  const onPressRight = () => {
    if (currentSr === '') {
      return;
    }
    const sr = StrokeRange.fromString(currentSr);
    dispatch(
      addStrokeCount(
        sr.startRange,
        sr.endRange,
        scWithTime.startTime,
        positionMillis,
        scWithTime.strokeCount
      )
    );
  };
  const time = 0;
  return (
    <Column>
      <Row justifyContent="space-around">
        <Button
          variant="subtle"
          size="sm"
          onPress={onPressLeft}
          colorScheme={'primary'}
        >
          {'Start:'}
          {formatTimeFromPosition(scWithTime.startTime)}
        </Button>
        <Button
          variant="subtle"
          size="sm"
          onPress={onPressRight}
          colorScheme={'primary'}
        >
          {'End:'}
          {formatTimeFromPosition(scWithTime.endTime)}
        </Button>
      </Row>
    </Column>
  );
}

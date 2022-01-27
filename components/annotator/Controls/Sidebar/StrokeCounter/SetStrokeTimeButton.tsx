import React from 'react';
import { Column, Row, Button } from 'native-base';

import { formatTimeFromPosition } from '../../../../../state/Util';
import { useAppSelector } from '../../../../../state/redux/hooks';
import { useDispatch } from 'react-redux';
import { addStrokeCount } from '../../../../../state/redux';
import { StrokeRange } from '../../../../../state/AKB';
import Hidden from '../../../../Hidden';
import { getPosition } from '../../../../../state/VideoService';

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

  const sr = StrokeRange.fromString(currentSr);
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

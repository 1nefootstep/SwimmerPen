import React from 'react';
import { Row } from 'native-base';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../state/redux/hooks';
import { addStrokeCount } from '../../../../../state/redux';
import { StrokeRange } from '../../../../../state/AKB';
import NumericInput from 'react-native-numeric-input';

export default function Select() {
  const dispatch = useAppDispatch();
  const currentSr = useAppSelector(state => state.controls.currentSr);
  const strokeCounts = useAppSelector(state => state.annotation.strokeCounts);
  const { startTime, endTime, strokeCount } =
    currentSr in strokeCounts
      ? strokeCounts[currentSr]
      : { strokeCount: 0, startTime: 0, endTime: 0 };
  return (
    <Row justifyContent="center" mb={2}>
      <NumericInput
        initValue={strokeCount}
        value={strokeCount}
        minValue={0}
        onChange={value => {
          if (currentSr !== '') {
            const { startRange, endRange } = StrokeRange.fromString(currentSr);
            dispatch(
              addStrokeCount(startRange, endRange, startTime, endTime, value)
            );
          }
        }}
        type="plus-minus"
        totalWidth={120}
        totalHeight={30}
        iconSize={12}
        inputStyle={{backgroundColor: 'white'}}
        leftButtonBackgroundColor="#f43f5e"
        rightButtonBackgroundColor="#10b981"
        step={0.5}
        iconStyle={{ color: 'white' }}
        valueType="integer"
        rounded
      />
    </Row>
  );
}

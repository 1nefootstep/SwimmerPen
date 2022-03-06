import React from 'react';
import { Text } from 'native-base';
import { formatTimeFromPosition } from '../../../../state/Util';
import { useAppSelector } from '../../../../state/redux/hooks';

export default function TimeDisplay() {
  const positionMillis = useAppSelector(state => state.video.positionMillis);
  const durationMillis = useAppSelector(state => state.video.durationMillis);
  return (
    <Text color="white">
      {`${formatTimeFromPosition(
        positionMillis,
        true
      )} / ${formatTimeFromPosition(durationMillis, true)}`}
    </Text>
  );
}

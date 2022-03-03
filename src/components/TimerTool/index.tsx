import React, { useContext } from 'react';
import SingleTimer from './SingleTimer';
import { VideoBoundContext } from '../VideoBoundContext';
import { useAppSelector } from '../../state/redux/hooks';

export default function TimerTool() {
  const timers = useAppSelector(state => state.controls.timers);
  const videoBound = useContext(VideoBoundContext);
  return (
    <>
      {timers.map(e => (
        <SingleTimer
          key={e.id}
          id={e.id}
          startPositionMillis={e.startTime}
          bounds={videoBound}
        />
      ))}
    </>
  );
}

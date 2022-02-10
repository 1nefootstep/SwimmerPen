import React, { useContext } from 'react';

import Point from './Point';
import { useAppSelector } from '../../state/redux/hooks';
import Hidden from '../Hidden';
import { LineContext } from './LineContext';
import { VideoBoundContext } from '../VideoBoundContext';
import LineDrawer from './LineDrawer';

export default function LineTool() {
  const isLineVisible = useAppSelector(state => state.controls.isLineVisible);
  const { p1X, p2X, p1Y, p2Y, setP1X, setP1Y, setP2X, setP2Y } =
    useContext(LineContext);
  const videoBound = useContext(VideoBoundContext);
  
  return (
    <Hidden isHidden={!isLineVisible}>
      <>
        <LineDrawer p1={{x: p1X, y: p1Y}} p2={{x: p2X, y: p2Y}} thickness={2}/>
        <Point pX={p1X} pY={p1Y} setX={setP1X} setY={setP1Y} bounds={videoBound} />
        <Point pX={p2X} pY={p2Y} setX={setP2X} setY={setP2Y} bounds={videoBound} />
      </>
    </Hidden>
  );
}

export * from './LineContext';

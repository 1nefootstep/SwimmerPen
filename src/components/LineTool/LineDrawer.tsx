import React from 'react';
import { Box } from 'native-base';

export interface XYCoordinateLoose {
  x?: number;
  y?: number;
}

export interface XYCoordinate {
  x: number;
  y: number;
}

export interface LineDrawerProps {
  p1: XYCoordinateLoose;
  p2: XYCoordinateLoose;
  thickness: number;
}

const DEG_90_IN_RAD = 1.5708;

function midpoint(p1: XYCoordinate, p2: XYCoordinate) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function distanceBetweenPoints(p1: XYCoordinate, p2: XYCoordinate) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.sqrt(a * a + b * b);
}

function angleRadOfPoints(p1: XYCoordinate, p2: XYCoordinate) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

// function angleDegOfPoints(p1: XYCoordinate, p2: XYCoordinate) {
//   return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
// }

function fixUndefinedPoint(p: XYCoordinateLoose): XYCoordinate {
  let x: number;
  let y: number;
  if (p.x === undefined) {
    x = 0;
  } else {
    x = p.x;
  }
  if (p.y === undefined) {
    y = 0;
  } else {
    y = p.y;
  }
  return { x: x, y: y };
}

function calcCircle(radians: number, radius: number) {
  return { x: Math.cos(radians) * radius, y: Math.sin(radians) * radius };
}

function calcOffset(radians: number, diameter: number) {
  const radius = diameter / 2;
  const initial = calcCircle(DEG_90_IN_RAD, radius);
  const after = calcCircle(radians + DEG_90_IN_RAD, radius);

  return { xOffset: -initial.x + after.x, yOffset: -initial.y + after.y };
}

export default function LineDrawer({ p1, p2, thickness }: LineDrawerProps) {
  const fixedP1 = fixUndefinedPoint(p1);
  const fixedP2 = fixUndefinedPoint(p2);
  // const centerOfPoints = midpoint(fixedP1, fixedP2);
  const length = distanceBetweenPoints(fixedP1, fixedP2);
  const angleRad = angleRadOfPoints(fixedP1, fixedP2) - DEG_90_IN_RAD;
  const { xOffset, yOffset } = calcOffset(angleRad, length);
  // const angleDeg = angleDegOfPoints(fixedP1, fixedP2) + 180;
  // //console.log(`midpoint: ${JSON.stringify(centerOfPoints)}, deg: -${angleDeg}`);
  // //console.log(`x:${fixedP1.x + xOffset}, y:${fixedP1.y + yOffset})`);
  return (
    <Box
      position="absolute"
      top={fixedP1.y}
      left={fixedP1.x}
      bg="danger.600"
      style={{
        left: fixedP1.x + xOffset,
        top: fixedP1.y + yOffset,
        height: length,
        width: thickness,
        transform: [{ rotate: `${angleRad}rad` }],
      }}
      // onLayout={({nativeEvent}) => {
      //   //console.log(JSON.stringify(nativeEvent.layout));
      // }}
    />
  );
}

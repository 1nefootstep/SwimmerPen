// import React from 'react';
// import { Box } from 'native-base';
// import Animated, {
//   SharedValue,
//   useAnimatedStyle,
// } from 'react-native-reanimated';

// // export interface XYCoordinateLoose {
// //   x?: number;
// //   y?: number;
// // }

// export interface XYCoordinate {
//   x: number;
//   y: number;
// }

// export interface SharedXYCoordinate {
//   x: SharedValue<number>;
//   y: SharedValue<number>;
// }

// export interface LineDrawerProps {
//   p1: SharedXYCoordinate;
//   p2: SharedXYCoordinate;
//   thickness: number;
// }

// // export interface LineDrawerProps {
// //   p1: XYCoordinateLoose;
// //   p2: XYCoordinateLoose;
// //   thickness: number;
// // }

// export const DEG_90_IN_RAD = 1.5708;

// export function distanceBetweenPoints(p1: XYCoordinate, p2: XYCoordinate) {
//   const a = p1.x - p2.x;
//   const b = p1.y - p2.y;
//   return Math.sqrt(a * a + b * b);
// }

// export function angleRadOfPoints(p1: XYCoordinate, p2: XYCoordinate) {
//   return Math.atan2(p2.y - p1.y, p2.x - p1.x);
// }

// export function extractSharedPoint(sharedPoint: SharedXYCoordinate): XYCoordinate {
//   let x = sharedPoint.x.value ?? 0;
//   let y = sharedPoint.y.value ?? 0;
//   if (isNaN(x)) {
//     x = 0;
//   }
//   if (isNaN(y)) {
//     y = 0;
//   }
//   return { x: x, y: y };
// }

// // function fixUndefinedPoint(p: XYCoordinateLoose): XYCoordinate {
// //   let x: number;
// //   let y: number;
// //   if (p.x === undefined) {
// //     x = 0;
// //   } else {
// //     x = p.x;
// //   }
// //   if (p.y === undefined) {
// //     y = 0;
// //   } else {
// //     y = p.y;
// //   }
// //   return { x: x, y: y };
// // }

// function calcCircle(radians: number, radius: number) {
//   return { x: Math.cos(radians) * radius, y: Math.sin(radians) * radius };
// }

// export function calcOffset(radians: number, diameter: number) {
//   const radius = diameter / 2;
//   const initial = calcCircle(DEG_90_IN_RAD, radius);
//   const after = calcCircle(radians + DEG_90_IN_RAD, radius);

//   return { xOffset: -initial.x + after.x, yOffset: -initial.y + after.y };
// }

// export default function LineDrawer({ p1, p2, thickness }: LineDrawerProps) {
//   // const fixedP1 = fixUndefinedPoint(p1);
//   // const fixedP2 = fixUndefinedPoint(p2);
//   const fixedP1 = extractSharedPoint(p1);
//   const fixedP2 = extractSharedPoint(p2);
//   const length = distanceBetweenPoints(fixedP1, fixedP2);
//   const angleRad = angleRadOfPoints(fixedP1, fixedP2) - DEG_90_IN_RAD;
//   const { xOffset, yOffset } = calcOffset(angleRad, length);
//   const style = useAnimatedStyle(() => ({
//     position: 'absolute',
//     left: fixedP1.x + xOffset,
//     top: fixedP1.y + yOffset,
//     height: length,
//     width: thickness,
//     backgroundColor: 'red',
//     transform: [{ rotate: `${angleRad}rad` }],
//   }));
//   return (
//     <Animated.View
//       style={style}
//     />
//   );
//   // return (
//   //   <Box
//   //     position="absolute"
//   //     top={fixedP1.y}
//   //     left={fixedP1.x}
//   //     bg="danger.600"
//   //     style={{
//   //       left: fixedP1.x + xOffset,
//   //       top: fixedP1.y + yOffset,
//   //       height: length,
//   //       width: thickness,
//   //       transform: [{ rotate: `${angleRad}rad` }],
//   //     }}
//   //   />
//   // );
// }

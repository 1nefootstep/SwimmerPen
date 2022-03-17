/* globals __detectSwimmers */
/* eslint-disable no-undef */
import type { Frame } from 'react-native-vision-camera';

export type BoundingFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface BoundingFrameTrio {
  prevPrevBf?: BoundingFrame;
  prevBf?: BoundingFrame;
  currBf?: BoundingFrame;
}

export type DetectedObj = {
  label: string;
  confidence: number;
  frame: BoundingFrame;
};

export type DetectionResult = {
  result: DetectedObj[];
};

export function detectSwimmers(frame: Frame): DetectionResult {
  'worklet';
  // @ts-ignore
  return __detectSwimmers(frame);
}

export function distanceBetweenBoundingFrame(
  bf1: BoundingFrame,
  bf2: BoundingFrame
) {
  const cx1 = bf1.x + bf1.width / 2;
  const cy1 = bf1.y + bf1.height / 2;
  const cx2 = bf2.x + bf2.width / 2;
  const cy2 = bf2.y + bf2.height / 2;
  return Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2));
}

export function findNearestBoundingFrame(
  bf: BoundingFrame,
  lsOfBf: Array<BoundingFrame>
) {
  if (lsOfBf.length > 0) {
    console.log(`finding nearest...`);
    const result = lsOfBf.reduce((prev, curr) => {
      const dist1 = distanceBetweenBoundingFrame(prev, bf);
      const dist2 = distanceBetweenBoundingFrame(curr, bf);
      console.log(`dist1: ${dist1}, dist2: ${dist2}`);
      if (dist2 < dist1) {
        return curr;
      } else {
        return prev;
      }
    });
    console.log(`result of nearest: ${JSON.stringify(result)}`);
    return result;
  }
  console.log(`returning null...`);
  return null;
}

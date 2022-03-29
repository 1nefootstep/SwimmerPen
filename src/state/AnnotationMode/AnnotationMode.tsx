import { Distance } from '../AKB/Annotations';
import { StrokeRange } from '../AKB/StrokeCounts';

export interface Checkpoint {
  name: string;
  distanceMeter: number;
}

export type AnnotationMode = {
  name: string;
  checkpoints: Checkpoint[];
  strokeRanges: StrokeRange[];
};

export type DistanceOrDone = Distance | 'DONE';

/**
 * Finds the next distance given an annotation mode and the current distance.
 * If unable to find next distance, because current distance could not be found
 * in mode currentDistance will be returned instead.
 * If current distance is the last distance in the checkpoint, 'DONE' will be returned.
 */
export function findNextDistance(
  mode: AnnotationMode,
  currentDistance: Distance
): DistanceOrDone {
  const currIndex = mode.checkpoints.findIndex(
    x => x.distanceMeter === currentDistance
  );
  const lastIndexOfMode = mode.checkpoints.length - 1;
  const nextIndex = currIndex + 1;
  if (currIndex === -1) {
    return currentDistance;
  }
  if (nextIndex > lastIndexOfMode) {
    return 'DONE';
  }
  return mode.checkpoints[nextIndex].distanceMeter;
}

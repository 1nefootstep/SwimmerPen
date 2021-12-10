import { Distance } from "../AKB/Annotations";
import { StrokeRange } from "../AKB/StrokeCounts";

export interface Checkpoint {
  name: string;
  distanceMeter: number;
}

export type AnnotationMode = {
  name: string;
  checkpoints: Checkpoint[];
  strokeRanges: StrokeRange[];
}

/**
 * Finds the next distance given an annotation mode and the current distance.
 * If unable to find next distance, because current distance could not be found
 * in mode or because current distance is the last distance in the checkpoint,
 * currentDistance will be returned instead.
 */
export function findNextDistance(mode: AnnotationMode, currentDistance: Distance): Distance {
  const currIndex = mode.checkpoints.findIndex(x => x.distanceMeter === currentDistance);
  const lastIndexOfMode = mode.checkpoints.length - 1;
  const nextIndex = currIndex + 1;
  if (currentDistance === -1 || nextIndex > lastIndexOfMode) {
    return currentDistance;
  }
  return mode.checkpoints[nextIndex].distanceMeter;
}
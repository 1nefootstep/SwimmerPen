import { StrokeRange } from '../AKB/StrokeCounts';
import { AnnotationMode, Checkpoint } from './AnnotationMode';

function firstLapCheckpoint(startDistance: number): Array<Checkpoint> {
  return [
    { name: `${startDistance}m`, distanceMeter: startDistance },
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 35}m`, distanceMeter: startDistance + 35 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

function subsequentLapCheckpointWith35(
  startDistance: number
): Array<Checkpoint> {
  return [
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 35}m`, distanceMeter: startDistance + 35 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

function subsequentLapCheckpoint(startDistance: number): Array<Checkpoint> {
  return [
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

function firstStrokeRangePerLap(startDistance: number): Array<StrokeRange> {
  return [
    new StrokeRange(startDistance + 15, startDistance + 25),
    new StrokeRange(startDistance + 25, startDistance + 45),
    // new StrokeRange(startDistance + 25, startDistance + 35),
    // new StrokeRange(startDistance + 35, startDistance + 45),
    new StrokeRange(startDistance, startDistance + 50),
  ];
}

function strokeRangePerLap(startDistance: number): Array<StrokeRange> {
  return [
    new StrokeRange(startDistance + 15, startDistance + 25),
    new StrokeRange(startDistance + 25, startDistance + 45),
    new StrokeRange(startDistance, startDistance + 50),
  ];
}

export function createAnnotationMode50m(totalDistance: number): AnnotationMode {
  let distanceLeft = totalDistance;
  let checkpoints: Array<Checkpoint> = [];
  let strokeRanges: Array<StrokeRange> = [];
  const POOL_DISTANCE = 50;
  let lastDistance = 0;
  while (distanceLeft > 0) {
    if (lastDistance === 0) {
      strokeRanges = strokeRanges.concat(firstStrokeRangePerLap(lastDistance));
      checkpoints = checkpoints.concat(firstLapCheckpoint(lastDistance));
    // } else if (lastDistance < 100) {
    //   strokeRanges = strokeRanges.concat(firstStrokeRangePerLap(lastDistance));
    //   checkpoints = checkpoints.concat(
    //     subsequentLapCheckpointWith35(lastDistance)
    //   );
    } else {
      strokeRanges = strokeRanges.concat(strokeRangePerLap(lastDistance));
      checkpoints = checkpoints.concat(subsequentLapCheckpoint(lastDistance));
    }
    lastDistance += POOL_DISTANCE;
    distanceLeft -= POOL_DISTANCE;
  }
  return {
    name: `50m Pool-${totalDistance}m`,
    checkpoints: checkpoints,
    strokeRanges: strokeRanges,
  };
}

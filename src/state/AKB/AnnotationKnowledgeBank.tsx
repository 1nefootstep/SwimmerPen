import {
  AnnotationMode,
  createAnnotationMode25m,
  createAnnotationMode50m,
} from '../AnnotationMode';
import { Annotations, Timestamp } from './Annotations';
import { StrokeCounts, StrokeRange } from './StrokeCounts';
import { PoolConfig, PoolDistance, RaceDistance } from './PoolConfig';

export type AnnotationInformation = {
  name: string;
  poolConfig: PoolConfig;
  annotations: Annotations;
  strokeCounts: StrokeCounts;
  frameTimes: Array<number>;
};

export type CheckpointResponse =
  | {
      found: false;
    }
  | {
      found: true;
      time: Timestamp;
    };

export type Modes = {
  [poolDistance in PoolDistance]: {
    [raceDistance in RaceDistance]: AnnotationMode;
  };
};

const modes: Modes = {
  '25m': {
    '50m': createAnnotationMode25m(50),
    '100m': createAnnotationMode25m(100),
    '200m': createAnnotationMode25m(200),
    '400m': createAnnotationMode25m(400),
    '800m': createAnnotationMode25m(800),
    '1500m': createAnnotationMode25m(1500),
  },
  '50m': {
    '50m': createAnnotationMode50m(50),
    '100m': createAnnotationMode50m(100),
    '200m': createAnnotationMode50m(200),
    '400m': createAnnotationMode50m(400),
    '800m': createAnnotationMode50m(800),
    '1500m': createAnnotationMode50m(1500),
  },
};

export function getModes(): Modes {
  return modes;
}

export function getDefaultMode(): AnnotationMode {
  return modes['50m']['100m'];
}

export function annotationIsDone({
  mode,
  annotationInfo,
}: {
  mode: AnnotationMode;
  annotationInfo: AnnotationInformation;
}): boolean {
  const allCheckpointsPresent = mode.checkpoints.every(
    e => e.distanceMeter in annotationInfo.annotations
  );
  const allStrokeCountPresent = mode.strokeRanges.every(e => {
    const sr = new StrokeRange(e.startRange, e.endRange).toString();
    return sr in annotationInfo.strokeCounts;
  });
  return allCheckpointsPresent && allStrokeCountPresent;
}

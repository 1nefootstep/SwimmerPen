import {
  AnnotationMode,
  createAnnotationMode25m,
  createAnnotationMode50m,
} from '../AnnotationMode';
import { Annotations, Timestamp } from './Annotations';
import { StrokeCounts } from './StrokeCounts';
import { PoolConfig, PoolDistance, RaceDistance } from './PoolConfig';

export type AnnotationInformation = {
  name: string;
  poolConfig: PoolConfig;
  annotations: Annotations;
  strokeCounts: StrokeCounts;
  frameTimes: Array<number>;
  avgFrameTime: number;
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
  },
  '50m': {
    '50m': createAnnotationMode50m(50),
    '100m': createAnnotationMode50m(100),
    '200m': createAnnotationMode50m(200),
    '400m': createAnnotationMode50m(400),
  },
};

export function getModes(): Modes {
  return modes;
}

export function getDefaultMode(): AnnotationMode {
  return modes['50m']['100m'];
}

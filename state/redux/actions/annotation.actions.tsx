import {
  AnnotationInformation,
  Distance,
  Timestamp,
  PoolDistance,
  RaceDistance,
  StrokeRange,
} from '../../AKB';
import {
  AddAnnotationAction,
  AddAvgFrameTimeAction,
  AddFrameTimesAction,
  AddStrokeCountAction,
  ClearAnnotatationAction,
  ClearAnnotationExceptPoolConfigAction,
  UpdateNameAction,
  UpdatePoolConfigAction,
} from '../types';

export enum ANNOTATION_ACTION_TYPES {
  ADD_ANNOTATION = 'ANNOTATION/ADD_ANNOTATION',
  ADD_STROKE_COUNT = 'ANNOTATION/ADD_STROKE_COUNT',
  CLEAR_ANNOTATION = 'ANNOTATION/CLEAR_ANNOTATION',
  CLEAR_ANNOTATION_EXCEPT_POOL_CONFIG = 'ANNOTATION/CLEAR_ANNOTATION_EXCEPT_POOL_CONFIG',
  UPDATE_NAME = 'ANNOTATION/UPDATE_NAME',
  UPDATE_POOL_CONFIG = 'ANNOTATION/UPDATE_POOL_CONFIG',
  ADD_FRAME_TIMES = 'ANNOTATION/ADD_FRAME_TIMES',
  LOAD_ANNOTATION = 'ANNOTATION/LOAD_ANNOTATION',
  ADD_AVG_FRAME_TIME = 'ANNOTATION/ADD_AVG_FRAME_TIME',
}

export function clearAnnotation(): ClearAnnotatationAction {
  return {
    type: ANNOTATION_ACTION_TYPES.CLEAR_ANNOTATION,
  };
}

export function addFrameTimes(frameTimes: Array<number>): AddFrameTimesAction {
  return {
    type: ANNOTATION_ACTION_TYPES.ADD_FRAME_TIMES,
    payload: { frameTimes: frameTimes },
  };
}

export function addAvgFrameTime(avgFrameTime: number): AddAvgFrameTimeAction {
  return {
    type: ANNOTATION_ACTION_TYPES.ADD_AVG_FRAME_TIME,
    payload: { avgFrameTime: avgFrameTime },
  };
}

export function clearAnnotationExceptPoolConfig(): ClearAnnotationExceptPoolConfigAction {
  return {
    type: ANNOTATION_ACTION_TYPES.CLEAR_ANNOTATION_EXCEPT_POOL_CONFIG,
  };
}

export function addAnnotation(
  distance: Distance,
  timestamp: Timestamp
): AddAnnotationAction {
  return {
    type: ANNOTATION_ACTION_TYPES.ADD_ANNOTATION,
    payload: { distance: distance, timestamp: timestamp },
  };
}

export function addStrokeCount(
  startRange: Distance,
  endRange: Distance,
  startTime: Timestamp,
  endTime: Timestamp,
  strokeCount: number
): AddStrokeCountAction {
  return {
    type: ANNOTATION_ACTION_TYPES.ADD_STROKE_COUNT,
    payload: {
      strokeRange: new StrokeRange(startRange, endRange),
      scWithTime: {
        startTime: startTime,
        endTime: endTime,
        strokeCount: strokeCount,
      },
    },
  };
}

export function updateName(name: string): UpdateNameAction {
  return {
    type: ANNOTATION_ACTION_TYPES.UPDATE_NAME,
    payload: {
      name: name,
    },
  };
}

export function updatePoolConfig(
  poolDistance: PoolDistance,
  raceDistance: RaceDistance
): UpdatePoolConfigAction {
  return {
    type: ANNOTATION_ACTION_TYPES.UPDATE_POOL_CONFIG,
    payload: {
      poolConfig: {
        poolDistance: poolDistance,
        raceDistance: raceDistance,
      },
    },
  };
}

export function resetPoolConfig(): UpdatePoolConfigAction {
  return {
    type: ANNOTATION_ACTION_TYPES.UPDATE_POOL_CONFIG,
    payload: {
      poolConfig: {
        poolDistance: '50m',
        raceDistance: '100m',
      },
    },
  };
}

export function loadAnnotation(
  annotationInfo: AnnotationInformation,
  name?: string
) {
  return {
    type: ANNOTATION_ACTION_TYPES.LOAD_ANNOTATION,
    payload: {
      annotation: annotationInfo,
      name: name ?? '',
    },
  };
}

import {
  AnnotationInformation,
  PoolDistance,
} from '../../AKB/AnnotationKnowledgeBank';
import { Distance, Timestamp } from '../../AKB/Annotations';
import { StrokeRange } from '../../AKB/StrokeCounts';
import {
  AddAnnotationAction,
  AddStrokeCountAction,
  ClearAnnotatationAction,
  UpdateNameAction,
  UpdatePoolConfigAction,
} from '../types';

export enum ANNOTATION_ACTION_TYPES {
  ADD_ANNOTATION = 'ANNOTATION/ADD_ANNOTATION',
  ADD_STROKE_COUNT = 'ANNOTATION/ADD_STROKE_COUNT',
  CLEAR_ANNOTATION = 'ANNOTATION/CLEAR_ANNOTATION',
  UPDATE_NAME = 'ANNOTATION/UPDATE_NAME',
  UPDATE_POOL_CONFIG = 'ANNOTATION/UPDATE_POOL_CONFIG',
  LOAD_ANNOTATION = 'ANNOTATION/LOAD_ANNOTATION',
}

export function clearAnnotation(): ClearAnnotatationAction {
  return {
    type: ANNOTATION_ACTION_TYPES.CLEAR_ANNOTATION,
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
  modeIndex: number
): UpdatePoolConfigAction {
  return {
    type: ANNOTATION_ACTION_TYPES.UPDATE_POOL_CONFIG,
    payload: {
      poolDistance: poolDistance,
      modeIndex: modeIndex,
    },
  };
}

export function resetPoolConfig(): UpdatePoolConfigAction {
  return {
    type: ANNOTATION_ACTION_TYPES.UPDATE_POOL_CONFIG,
    payload: {
      poolDistance: PoolDistance.Unassigned,
      modeIndex: -1,
    }
  }
}

export function loadAnnotation(annotationInfo: AnnotationInformation) {
  return {
    type: ANNOTATION_ACTION_TYPES.LOAD_ANNOTATION,
    payload: {
      annotationInfo: annotationInfo,
    },
  };
}
import { Distance } from '../../AKB';
import { DistanceOrDone } from '../../AnnotationMode';
import { UnixTime } from '../../UnixTime';
import {
  StartRecordingAction,
  StopRecordingAction,
  UpdateDistanceAction,
  UpdateLastRecordedUriAction,
} from '../types';

export enum RECORDING_ACTION_TYPES {
  START_RECORDING = 'RECORDING/START_RECORDING',
  STOP_RECORDING = 'RECORDING/STOP_RECORDING',
  UPDATE_DISTANCE = 'RECORDING/UPDATE_DISTANCE',
  UPDATE_LAST_RECORDED_URI = 'RECORDING/UPDATE_LAST_RECORDED_URI',
}

export function startRecording(startTime: UnixTime): StartRecordingAction {
  return {
    type: RECORDING_ACTION_TYPES.START_RECORDING,
    payload: { startTime: startTime },
  };
}

export function stopRecording(): StopRecordingAction {
  return {
    type: RECORDING_ACTION_TYPES.STOP_RECORDING,
  };
}

export function updateDistance(distance: DistanceOrDone): UpdateDistanceAction {
  return {
    type: RECORDING_ACTION_TYPES.UPDATE_DISTANCE,
    payload: { distance: distance },
  };
}

export function updateLastRecordedUri(
  uri: string
): UpdateLastRecordedUriAction {
  return {
    type: RECORDING_ACTION_TYPES.UPDATE_DISTANCE,
    payload: { lastRecordedUri: uri },
  };
}

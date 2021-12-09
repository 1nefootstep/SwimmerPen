import { UnixTime } from '../../UnixTime';
import { StartRecordingAction } from '../types';

export enum RECORDING_ACTION_TYPES {
  START_RECORDING = 'RECORDING/START_RECORDING',
}

export function startRecording(
  startRecordTime: UnixTime
): StartRecordingAction {
  return {
    type: RECORDING_ACTION_TYPES.START_RECORDING,
    payload: { startRecordTime: startRecordTime },
  };
}

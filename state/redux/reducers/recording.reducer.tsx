import { Distance } from '../../AKB/Annotations';
import { UnixTime } from '../../UnixTime';
import { RECORDING_ACTION_TYPES } from '../actions';
import { RecordingActionTypes, UpdateDistanceAction, UpdateLastRecordedUriAction } from '../types';

export type RecordingInfo = {
  isRecording: boolean;
  startRecordTime: UnixTime;
  currentDistance: Distance;
  lastRecordedUri: string;
};

function initState(): RecordingInfo {
  return {
    isRecording: false,
    startRecordTime: 0,
    currentDistance: 0,
    lastRecordedUri: '',
  };
}

const initialState: RecordingInfo = initState();

export function recordingReducer(
  state: RecordingInfo = initialState,
  action: RecordingActionTypes
): RecordingInfo {
  switch (action.type) {
    case RECORDING_ACTION_TYPES.START_RECORDING: {
      const startRecordTime: UnixTime = Date.now();
      return { ...state, isRecording: true, startRecordTime: startRecordTime };
    }
    case RECORDING_ACTION_TYPES.STOP_RECORDING: {
      return { ...state, isRecording: false, currentDistance: 0 };
    }
    case RECORDING_ACTION_TYPES.UPDATE_DISTANCE: {
      const { payload } = action as UpdateDistanceAction;
      const { distance } = payload;
      return { ...state, currentDistance: distance};
    }
    case RECORDING_ACTION_TYPES.UPDATE_LAST_RECORDED_URI: {
      const { payload } = action as UpdateLastRecordedUriAction;
      const { lastRecordedUri } = payload;
      return { ...state, lastRecordedUri: lastRecordedUri};
    }
    default:
      return state;
  }
}

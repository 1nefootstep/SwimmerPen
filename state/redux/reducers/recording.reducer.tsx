import { UnixTime } from '../../UnixTime';
import { RECORDING_ACTION_TYPES } from '../actions';
import { RecordingActionTypes, StartRecordingAction } from '../types';

type RecordingInfo = {
  startRecordTime: UnixTime;
};

function initState(): RecordingInfo {
  return {
    startRecordTime: 0,
  };
}

const initialState: RecordingInfo = initState();

export function recordingReducer(
  state: RecordingInfo = initialState,
  action: RecordingActionTypes
): RecordingInfo {
  switch (action.type) {
    case RECORDING_ACTION_TYPES.START_RECORDING: {
      const { payload } = action as StartRecordingAction;
      const { startRecordTime } = payload;
      return { ...state, startRecordTime: startRecordTime };
    }
    default:
      return state;
  }
}

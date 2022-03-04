import { VIDEO_ACTION_TYPES } from '../actions/video.actions';
import { UpdateStatusAction, VideoActionTypes } from '../types';

export type VideoInfo = {
  isControlVisible: boolean;
  isTimeVisible: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  isLoaded: boolean;
  uri: string;
};

function initState(): VideoInfo {
  return {
    isControlVisible: false,
    isTimeVisible: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    isLoaded: false,
    uri: '',
  };
}

const initialState: VideoInfo = initState();

export function videoReducer(
  state: VideoInfo = initialState,
  action: VideoActionTypes
): VideoInfo {
  switch (action.type) {
    case VIDEO_ACTION_TYPES.UPDATE_STATUS: {
      const { payload } = action as UpdateStatusAction;
      const { isLoaded, isPlaying, positionMillis, durationMillis, uri } = payload;
      return {
        ...state,
        isLoaded: isLoaded,
        positionMillis: positionMillis,
        durationMillis: durationMillis,
        isPlaying: isPlaying,
        uri: uri,
      };
    }
    case VIDEO_ACTION_TYPES.CLEAR_VIDEO_STATUS: {
      return {
        ...state,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: 0,
        isLoaded: false,
        uri: '',
      };
    }
    case VIDEO_ACTION_TYPES.SHOW_CONTROL: {
      return {
        ...state,
        isControlVisible: true,
      };
    }
    case VIDEO_ACTION_TYPES.HIDE_CONTROL: {
      return {
        ...state,
        isControlVisible: false,
      };
    }
    case VIDEO_ACTION_TYPES.SHOW_TIME: {
      return {
        ...state,
        isTimeVisible: true,
      };
    }
    case VIDEO_ACTION_TYPES.HIDE_TIME: {
      return {
        ...state,
        isTimeVisible: false,
      };
    }
    default:
      return state;
  }
}

import { AVPlaybackStatus } from 'expo-av';
import { VIDEO_ACTION_TYPES } from '../actions/video.actions';
import { UpdateStatusAction, VideoActionTypes } from '../types';

export type VideoInfo = {
  isControlVisible: boolean;
  isTimeVisible: boolean;
  status: AVPlaybackStatus | null;
  positionMillis: number;
  durationMillis: number;
  isLoaded: boolean;
};

function initState(): VideoInfo {
  return {
    isControlVisible: false,
    isTimeVisible: false,
    status: null,
    positionMillis: 0,
    durationMillis: 0,
    isLoaded: false,
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
      const { status } = payload;
      const isLoaded = status.isLoaded;
      const positionMillis = isLoaded ? status.positionMillis : 0;
      const durationMillis =
        isLoaded && status.durationMillis !== undefined
          ? status.durationMillis
          : 0;
      return {
        ...state,
        status: status,
        positionMillis: positionMillis,
        durationMillis: durationMillis,
      };
    }
    case VIDEO_ACTION_TYPES.CLEAR_VIDEO_STATUS: {
      return {
        ...state,
        status: null,
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

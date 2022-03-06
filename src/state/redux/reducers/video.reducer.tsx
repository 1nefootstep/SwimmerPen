import { VIDEO_ACTION_TYPES } from '../actions/video.actions';
import {
  FrameLoadingStatus,
  SetFrameLoadingStatusAction,
  UpdateStatusAction,
  VideoActionTypes,
} from '../types';

export type VideoInfo = {
  isTimeVisible: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  isLoaded: boolean;
  uri: string;
  frameLoadingStatus: FrameLoadingStatus;
};

function initState(): VideoInfo {
  return {
    isTimeVisible: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    isLoaded: false,
    uri: '',
    frameLoadingStatus: 'unknown',
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
      const { isLoaded, isPlaying, positionMillis, durationMillis, uri } =
        payload;
      return {
        ...state,
        isLoaded: isLoaded ?? state.isLoaded,
        positionMillis: positionMillis ?? state.positionMillis,
        durationMillis: durationMillis ?? state.durationMillis,
        isPlaying: isPlaying ?? state.isPlaying,
        uri: uri ?? state.uri,
      };
    }
    case VIDEO_ACTION_TYPES.CLEAR_VIDEO_STATUS: {
      return initState();
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
    case VIDEO_ACTION_TYPES.SET_FRAME_LOADING_STATUS: {
      const { payload } = action as SetFrameLoadingStatusAction;
      const { frameLoadingStatus } = payload;
      return {
        ...state,
        frameLoadingStatus: frameLoadingStatus,
      };
    }
    default:
      return state;
  }
}

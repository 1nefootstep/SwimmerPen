import { AVPlaybackStatus } from "expo-av";
import { VIDEO_ACTION_TYPES } from "../actions/video.actions";
import { UpdateStatusAction, VideoActionTypes } from "../types";

export type VideoInfo = {
  isControlVisible: boolean;
  isTimeVisible: boolean;
  status: AVPlaybackStatus | null;  
};

function initState(): VideoInfo {
  return {
    isControlVisible: false,
    isTimeVisible: false,
    status: null,
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
      return {
        ...state,
        status: status,
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

import { AVPlaybackStatus } from "expo-av";
import { VIDEO_ACTION_TYPES } from "../actions/video.actions";
import { UpdateStatusAction, VideoActionTypes } from "../types";

export type VideoInfo = {
  isLoaded: boolean;
  status?: AVPlaybackStatus;
};

function initState(): VideoInfo {
  return {
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
      return {
        ...state,
        status: status,
      };
    }
    default:
      return state;
  }
}

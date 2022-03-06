import {
  ClearStatusAction,
  FrameLoadingStatus,
  HideControlAction,
  HideTimeAction,
  SetFrameLoadingStatusAction,
  ShowTimeAction,
  UpdateStatusAction,
} from '../types';

export enum VIDEO_ACTION_TYPES {
  UPDATE_STATUS = 'VIDEO/UPDATE_STATUS',
  CLEAR_VIDEO_STATUS = 'VIDEO/CLEAR_VIDEO_STATUS',
  SHOW_CONTROL = 'VIDEO/SHOW_CONTROL',
  HIDE_CONTROL = 'VIDEO/HIDE_CONTROL',
  SHOW_TIME = 'VIDEO/SHOW_TIME',
  HIDE_TIME = 'VIDEO/HIDE_TIME',
  SET_FRAME_LOADING_STATUS = 'VIDEO/SET_FRAME_LOADING_STATUS',
}

export function updateVideoStatus({
  isLoaded,
  isPlaying,
  positionMillis,
  durationMillis,
  uri,
}: {
  isLoaded?: boolean;
  isPlaying?: boolean;
  positionMillis?: number;
  durationMillis?: number;
  uri?: string;
}): UpdateStatusAction {
  return {
    type: VIDEO_ACTION_TYPES.UPDATE_STATUS,
    payload: {
      isLoaded: isLoaded,
      isPlaying: isPlaying,
      positionMillis: positionMillis,
      durationMillis: durationMillis,
      uri: uri,
    },
  };
}

export function clearVideoStatus(): ClearStatusAction {
  return {
    type: VIDEO_ACTION_TYPES.CLEAR_VIDEO_STATUS,
  };
}

export function showTime(): ShowTimeAction {
  return {
    type: VIDEO_ACTION_TYPES.SHOW_TIME,
  };
}

export function hideTime(): HideTimeAction {
  return {
    type: VIDEO_ACTION_TYPES.HIDE_TIME,
  };
}

export function setFrameLoadingStatus(
  frameLoadingStatus: FrameLoadingStatus
): SetFrameLoadingStatusAction {
  return {
    type: VIDEO_ACTION_TYPES.SET_FRAME_LOADING_STATUS,
    payload: {
      frameLoadingStatus: frameLoadingStatus,
    },
  };
}

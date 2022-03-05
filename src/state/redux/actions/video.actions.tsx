import { AVPlaybackStatus } from 'expo-av';

export enum VIDEO_ACTION_TYPES {
  UPDATE_STATUS = 'VIDEO/UPDATE_STATUS',
  CLEAR_VIDEO_STATUS = 'VIDEO/CLEAR_VIDEO_STATUS',
  SHOW_CONTROL = 'VIDEO/SHOW_CONTROL',
  HIDE_CONTROL = 'VIDEO/HIDE_CONTROL',
  SHOW_TIME = 'VIDEO/SHOW_TIME',
  HIDE_TIME = 'VIDEO/HIDE_TIME',
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
}) {
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

export function clearVideoStatus() {
  return {
    type: VIDEO_ACTION_TYPES.CLEAR_VIDEO_STATUS,
  };
}

export function showControl() {
  return {
    type: VIDEO_ACTION_TYPES.SHOW_CONTROL,
  };
}

export function hideControl() {
  return {
    type: VIDEO_ACTION_TYPES.HIDE_CONTROL,
  };
}

export function showTime() {
  return {
    type: VIDEO_ACTION_TYPES.SHOW_TIME,
  };
}

export function hideTime() {
  return {
    type: VIDEO_ACTION_TYPES.HIDE_TIME,
  };
}

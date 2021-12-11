import { AVPlaybackStatus } from 'expo-av';
import { Distance } from '../../AKB';
import {
  StartRecordingAction,
  StopRecordingAction,
  UpdateDistanceAction,
  UpdateLastRecordedUriAction,
} from '../types';

export enum VIDEO_ACTION_TYPES {
  UPDATE_STATUS = 'VIDEO/UPDATE_STATUS',
  CLEAR_VIDEO_STATUS = "VIDEO/CLEAR_VIDEO_STATUS",
  SHOW_CONTROL = 'VIDEO/SHOW_CONTROL',
  HIDE_CONTROL = 'VIDEO/HIDE_CONTROL',  
}

export function updateVideoStatus(status: AVPlaybackStatus) {
  return {
    type: VIDEO_ACTION_TYPES.UPDATE_STATUS,
    payload: { status: status },
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
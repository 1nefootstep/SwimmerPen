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
}

export function updateVideoStatus(status: AVPlaybackStatus) {
  return {
    type: VIDEO_ACTION_TYPES.UPDATE_STATUS,
    payload: { status: status },
  };
}

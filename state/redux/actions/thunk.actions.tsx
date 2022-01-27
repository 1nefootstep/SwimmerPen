import { ThunkAction } from 'redux-thunk';

import {
  getDefaultMode,
  getModes,
  PoolDistance,
  RaceDistance,
} from '../../AKB';
import { findNextDistance } from '../../AnnotationMode';
import { RootState } from '../reducers';
import * as FileHandler from '../../../FileHandler';
import { AppActionTypes } from '../types';
import {
  addAnnotation,
  updatePoolConfig,
  clearAnnotationExceptPoolConfig,
} from './annotation.actions';
import { updateDistance, stopRecording } from './recording.actions';
import { setCurrentDistance } from './controls.actions';
import { UnixTime } from '../../UnixTime';
import { batch } from 'react-redux';
import { breakUri, SaveVideoResult } from '../../../FileHandler';

export type AppThunkAction = ThunkAction<
  void,
  RootState,
  unknown,
  AppActionTypes
>;

export function addAnnotationWhileRecording(
  currentTime: UnixTime
): AppThunkAction {
  return (dispatch, getState) => {
    const { annotation, recording } = getState();
    // simply do nothing if we aren't recording
    if (!recording.isRecording) {
      return;
    }
    const timeInMs = currentTime - recording.startRecordTime;
    if (recording.currentDistance !== 'DONE') {
      dispatch(addAnnotation(recording.currentDistance, timeInMs));
      const { poolDistance, raceDistance } = annotation.poolConfig;
      const mode = getModes()[poolDistance][raceDistance] ?? getDefaultMode();
      const nextDistance = findNextDistance(mode, recording.currentDistance);
      dispatch(updateDistance(nextDistance));
    }
  };
}

export function saveAnnotation(basename?: string): AppThunkAction {
  return async (dispatch, getState) => {
    const { video, annotation } = getState();
    if (basename !== undefined) {
      FileHandler.saveAnnotation(basename, annotation);
    } else {
      const videoStatus = video.status;
      if (videoStatus === null || !videoStatus.isLoaded) {
        console.log(
          "Cannot save annotation because don't have base name nor video loaded."
        );
        return;
      }
      const { baseName } = breakUri(videoStatus.uri);
      FileHandler.saveAnnotation(baseName, annotation);
    }
  };
}

export function saveVideoAndAnnotation(
  // saveVideoResult: SaveVideoResult,
  uri: string
): AppThunkAction {
  return async (dispatch, getState) => {
    const { annotation } = getState();
    const saveVideoResult: SaveVideoResult = await FileHandler.saveVideo(uri);
    if (saveVideoResult.isSuccessful) {
      const { baseName } = FileHandler.breakUri(saveVideoResult.filename);
      annotation.name = baseName;
      FileHandler.saveAnnotation(baseName, annotation);
      dispatch(clearAnnotationExceptPoolConfig());
    }
  };
}

export function updatePoolConfigAndResetCurrentDistance(
  poolDistance: PoolDistance,
  raceDistance: RaceDistance
): AppThunkAction {
  return (dispatch, getState) => {
    batch(() => {
      dispatch(updatePoolConfig(poolDistance, raceDistance));
      dispatch(setCurrentDistance(0));
    });
  };
}

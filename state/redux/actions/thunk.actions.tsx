import { ThunkAction } from 'redux-thunk';

import { getDefaultMode, getModes } from '../../AKB';
import { findNextDistance } from '../../AnnotationMode';
import { RootState } from '../reducers';
import * as FileHandler from '../../../FileHandler';
import { AppActionTypes } from '../types';
import { addAnnotation } from './annotation.actions';
import { updateDistance, updateLastRecordedUri } from './recording.actions';

export type AppThunkAction = ThunkAction<
  void,
  RootState,
  unknown,
  AppActionTypes
>;

export function addAnnotationWhileRecording(): AppThunkAction {
  return (dispatch, getState) => {
    const { annotation, recording } = getState();
    // simply do nothing if we aren't recording
    if (!recording.isRecording) {
      return;
    }
    const timeInMs = Date.now() - recording.startRecordTime;
    dispatch(addAnnotation(recording.currentDistance, timeInMs));
    const { poolDistance, raceDistance } = annotation.poolConfig;
    const mode = getModes()[poolDistance][raceDistance] ?? getDefaultMode();
    const nextDistance = findNextDistance(mode, recording.currentDistance);
    dispatch(updateDistance(nextDistance));
  };
}

export function saveAnnotation(basename: string): AppThunkAction {
  return async (dispatch, getState) => {
    const { annotation } = getState();
    FileHandler.saveAnnotation(basename, annotation);
  };
}

export function saveVideoAndAnnotation(uri: string): AppThunkAction {
  return async (dispatch, getState) => {
    const { annotation } = getState();
    const saveVideoResult = await FileHandler.saveVideo(uri);
    if (saveVideoResult.isSuccessful) {
      const { baseName } = FileHandler.breakUri(saveVideoResult.filename);
      FileHandler.saveAnnotation(baseName, annotation);
      dispatch(updateLastRecordedUri(saveVideoResult.uri));
    }
  };
}

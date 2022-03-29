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
  addFrameTimes,
} from './annotation.actions';
import { setFrameLoadingStatus } from './video.actions';
import { stopRecording as stopRecordingAction } from './recording.actions';
import { updateDistance } from './recording.actions';
import { setCurrentDistance } from './controls.actions';
import { UnixTime } from '../../UnixTime';
import { batch } from 'react-redux';
import { breakUri, SaveVideoResult } from '../../../FileHandler';
import { getFrametimes } from '../../VideoProcessor';

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
      console.log(`nextDistance: ${nextDistance} mode: ${JSON.stringify(mode)}`)
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
      if (!video.isLoaded) {
        return;
      }
      const { baseName } = breakUri(video.uri);
      FileHandler.saveAnnotation(baseName, annotation);
      console.log(
        `saved at thunk... baseName: ${baseName} ${JSON.stringify(
          annotation.annotations
        )}`
      );
    }
  };
}

export function saveVideoAndAnnotation({
  uri,
  stopRecording = false,
}: {
  uri: string;
  stopRecording?: boolean;
}): AppThunkAction {
  return async (dispatch, getState) => {
    const { annotation } = getState();
    const saveVideoResult: SaveVideoResult = await FileHandler.saveVideo(uri);
    if (saveVideoResult.isSuccessful) {
      const { baseName } = FileHandler.breakUri(saveVideoResult.filename);
      annotation.name = baseName;
      FileHandler.saveAnnotation(baseName, annotation);
      dispatch(clearAnnotationExceptPoolConfig());
      if (stopRecording) {
        dispatch(stopRecordingAction());
      }
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

function fn(uri: string, dispatch: any) {
  'worklet';
  getFrametimes(uri)
    .then(async session => {
      // Console output generated for this execution
      const output: {
        frames: Array<{ best_effort_timestamp_time: string }>;
      } = JSON.parse(await session.getOutput());
      const frameTimesInMillis = output.frames.map(e => {
        const n = Number(e.best_effort_timestamp_time);
        if (isNaN(n) || n === undefined || n === null) {
          return 0;
        }
        return n * 1000;
      });
      dispatch(addFrameTimes(frameTimesInMillis));
      dispatch(setFrameLoadingStatus('loaded'));
    })
    .catch(e => {
      dispatch(setFrameLoadingStatus('failed'));
    });
}


export function processFrames(uri: string): AppThunkAction {
  return (dispatch, getState) => {
    const { annotation } = getState();
    if (annotation.frameTimes.length !== 0) {
      dispatch(setFrameLoadingStatus('loaded'));
      return;
    }
    dispatch(setFrameLoadingStatus('loading'));
    fn(uri, dispatch);
  };
}

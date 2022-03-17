import { ThunkAction } from 'redux-thunk';
import {
  getDefaultMode,
  getModes,
  Modes,
  PoolDistance,
  RaceDistance,
  StrokeRange,
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
import { addManyStrokeCount } from './annotation.actions';
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

export interface DistanceToScWithTime {
  [distance: number | string]: { sc: number; time: number };
}

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

export function addAiEstimatedSc(
  distToSc: DistanceToScWithTime
): AppThunkAction {
  return (dispatch, getState) => {
    const { annotation, recording } = getState();
    const startRecordTime = recording.startRecordTime;
    const { poolDistance, raceDistance } = annotation.poolConfig;
    const modes: Modes = getModes();
    const mode = modes[poolDistance][raceDistance];
    const shifted = Object.fromEntries(
      Object.entries(distToSc)
        .filter(e => e[0] !== 'DONE')
        .map(e => {
          const [key, value] = e;
          const nextDist = findNextDistance(mode, parseInt(key));
          return [key, distToSc[nextDist]];
        })
    );
    console.log(`ai sc annotations: ${JSON.stringify(shifted)}`);
    const formattedScWithTime = mode.strokeRanges
      .filter(sr => {
        const first = shifted[sr.startRange];
        const second = shifted[sr.endRange];
        return first !== undefined && second !== undefined;
      })
      .map(sr => {
        const first = shifted[sr.startRange];
        const second = shifted[sr.endRange];
        return {
          startRange: sr.startRange,
          endRange: sr.endRange,
          startTime: first.time - startRecordTime,
          endTime: second.time - startRecordTime,
          strokeCount: second.sc - first.sc,
        };
      });
    console.log(`formatted: ${JSON.stringify(formattedScWithTime)}`);
    dispatch(addManyStrokeCount(formattedScWithTime));
    const basename = annotation.name;
    const copied = { ...annotation };
    formattedScWithTime
      .map(e => ({
        strokeRange: new StrokeRange(e.startRange, e.endRange),
        scWithTime: {
          startTime: e.startTime,
          endTime: e.endTime,
          strokeCount: e.strokeCount,
        },
      }))
      .forEach(e => {
        copied.strokeCounts[e.strokeRange.toString()] = e.scWithTime;
      });
    FileHandler.saveAnnotation(basename, copied);
    console.log(
      `saved at thunk... baseName: ${basename} ${JSON.stringify(
        copied.annotations
      )} \n${JSON.stringify(copied.strokeCounts)}`
    );
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
      // dispatch(clearAnnotationExceptPoolConfig());
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

import { Distance } from '../../AKB/Annotations';

export type StartRecordingAction = {
  type: string;
};

export type StopRecordingAction = {
  type: string;
};

export type UpdateDistanceAction = {
  type: string;
  payload: { distance: Distance };
};

export type UpdateLastRecordedUriAction = {
  type: string;
  payload: { lastRecordedUri: string };
};

export type RecordingActionTypes =
  | StartRecordingAction
  | StopRecordingAction
  | UpdateDistanceAction
  | UpdateLastRecordedUriAction;

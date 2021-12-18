import { Distance } from '../../AKB/Annotations';
import { DistanceOrDone } from '../../AnnotationMode';

export type StartRecordingAction = {
  type: string;
};

export type StopRecordingAction = {
  type: string;
};

export type UpdateDistanceAction = {
  type: string;
  payload: { distance: DistanceOrDone };
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

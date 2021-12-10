import { AnnotationInformation } from '../../AKB/AnnotationKnowledgeBank';
import { Distance, Timestamp } from '../../AKB/Annotations';
import { PoolConfig } from '../../AKB/PoolConfig';
import { StrokeCountWithTimes, StrokeRange } from '../../AKB/StrokeCounts';

export type AddAnnotationAction = {
  type: string;
  payload: { distance: Distance; timestamp: Timestamp };
};

export type AddStrokeCountAction = {
  type: string;
  payload: { strokeRange: StrokeRange; scWithTime: StrokeCountWithTimes };
};

export type ClearAnnotatationAction = {
  type: string;
};

export type UpdateNameAction = {
  type: string;
  payload: { name: string };
};

export type UpdatePoolConfigAction = {
  type: string;
  payload: { poolConfig: PoolConfig };
};

export type LoadAnnotationAction = {
  type: string;
  payload: { annotation: AnnotationInformation };
};

export type SaveAnnotationAction = {
  type: string;
  payload: { filename: string };
};

export type SaveVideoAndAnnotationAction = {
  type: string;
  payload: { uri: string };
};

export type AnnotationActionTypes =
  | AddAnnotationAction
  | ClearAnnotatationAction
  | AddStrokeCountAction
  | UpdateNameAction
  | UpdatePoolConfigAction
  | LoadAnnotationAction;

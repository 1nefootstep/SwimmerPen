import { AVPlaybackStatus } from 'expo-av';

export type UpdateStatusAction = {
  type: string;
  payload: { status: AVPlaybackStatus };
};

export type ClearStatusAction = {
  type: string;
};


export type ShowControlAction = {
  type: string;
};

export type HideControlAction = {
  type: string;
};

export type VideoActionTypes =
  | UpdateStatusAction
  | ClearStatusAction
  | ShowControlAction
  | HideControlAction;

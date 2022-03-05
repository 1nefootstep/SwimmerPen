import { AVPlaybackStatus } from 'expo-av';

export type UpdateStatusAction = {
  type: string;
  payload: {
    isLoaded?: boolean;
    isPlaying?: boolean;
    positionMillis?: number;
    durationMillis?: number;
    uri?: string;
  };
};

export type ClearStatusAction = {
  type: string;
};

export type ShowTimeAction = {
  type: string;
};

export type HideTimeAction = {
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
  | ShowTimeAction
  | HideTimeAction
  | ShowControlAction
  | HideControlAction;

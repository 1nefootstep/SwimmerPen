export type FrameLoadingStatus = 'unknown' | 'loading' | 'loaded' | 'failed';

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

export type SetFrameLoadingStatusAction = {
  type: string;
  payload: {
    frameLoadingStatus: FrameLoadingStatus;
  };
};

export type VideoActionTypes =
  | UpdateStatusAction
  | ClearStatusAction
  | ShowTimeAction
  | HideTimeAction
  | SetFrameLoadingStatusAction;

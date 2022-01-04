export type SetCurrentDistanceAction = {
  type: string;
  payload: { currentDistance: number };
};

export type SetCurrentStrokeRangeAction = {
  type: string;
  payload: { sr: string };
};

export type ShowLineAction = {
  type: string;
};

export type HideLineAction = {
  type: string;
};

export type AddTimerAction = {
  type: string;
  payload: { startTime: number };
};

export type RemoveTimerAction = {
  type: string;
  payload: { startTime: number };
};

export type ControlsActionTypes =
  | SetCurrentDistanceAction
  | ShowLineAction
  | HideLineAction
  | AddTimerAction
  | RemoveTimerAction
  | SetCurrentStrokeRangeAction;

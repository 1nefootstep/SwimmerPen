// export type XYCoordinate = {
//   x: number;
//   y: number;
// };

export type SetCurrentDistanceAction = {
  type: string;
  payload: { currentDistance: number };
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

// export type SetLinePointsAction = {
//   type: string;
//   payload: { points: { p1: XYCoordinate; p2: XYCoordinate } };
// };

export type ControlsActionTypes =
  | SetCurrentDistanceAction
  | ShowLineAction
  | HideLineAction
  | AddTimerAction
  | RemoveTimerAction;
// | SetLinePointsAction;

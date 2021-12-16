export type SetCurrentDistanceAction = {
  type: string;
  payload: { currentDistance: number };
};

export type ControlsActionTypes = SetCurrentDistanceAction;

import { SetCurrentDistanceAction } from "../types";

export enum CONTROLS_ACTION_TYPES {
  SET_CURRENT_DISTANCE = 'CONTROLS/SET_CURRENT_DISTANCE',
}

export function setCurrentDistance(distance: number): SetCurrentDistanceAction{
  return {
    type: CONTROLS_ACTION_TYPES.SET_CURRENT_DISTANCE,
    payload: { currentDistance: distance },
  };
}

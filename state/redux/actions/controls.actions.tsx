import {
  AddTimerAction,
  HideLineAction,
  RemoveTimerAction,
  SetCurrentDistanceAction,
  // SetLinePointsAction,
  ShowLineAction,
  // XYCoordinate,
} from '../types';

export enum CONTROLS_ACTION_TYPES {
  SET_CURRENT_DISTANCE = 'CONTROLS/SET_CURRENT_DISTANCE',
  SHOW_LINE = 'CONTROLS/SHOW_LINE',
  HIDE_LINE = 'CONTROLS/HIDE_LINE',
  ADD_TIMER = 'CONTROLS/ADD_TIMER',
  REMOVE_TIMER = 'CONTROLS/REMOVE_TIMER',
  // SET_LINE_POINTS = 'CONTROLS/SET_LINE_POINTS',
}

export function setCurrentDistance(distance: number): SetCurrentDistanceAction {
  return {
    type: CONTROLS_ACTION_TYPES.SET_CURRENT_DISTANCE,
    payload: { currentDistance: distance },
  };
}

export function showLine(): ShowLineAction {
  return {
    type: CONTROLS_ACTION_TYPES.SHOW_LINE,
  };
}

export function hideLine(): HideLineAction {
  return {
    type: CONTROLS_ACTION_TYPES.HIDE_LINE,
  };
}

export function addTimer(startTime: number): AddTimerAction {
  return {
    type: CONTROLS_ACTION_TYPES.ADD_TIMER,
    payload: { startTime: startTime },
  };
}

export function removeTimer(startTime: number): RemoveTimerAction {
  return {
    type: CONTROLS_ACTION_TYPES.REMOVE_TIMER,
    payload: { startTime: startTime },
  };
}

// export function setLinePoints(
//   p1: XYCoordinate,
//   p2: XYCoordinate
// ): SetLinePointsAction {
//   return {
//     type: CONTROLS_ACTION_TYPES.HIDE_LINE,
//     payload: { points: { p1: p1, p2: p2 } },
//   };
// }

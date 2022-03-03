import {
  AddTimerAction,
  ClearControlsAction,
  HideLineAction,
  RemoveTimerAction,
  SetCurrentDistanceAction,
  SetCurrentStrokeRangeAction,
  ShowLineAction,
} from '../types';

export enum CONTROLS_ACTION_TYPES {
  CLEAR_CONTROLS = 'CONTROLS/CLEAR_CONTROLS',
  SET_CURRENT_DISTANCE = 'CONTROLS/SET_CURRENT_DISTANCE',
  SET_CURRENT_STROKE_RANGE = 'CONTROLS/SET_CURRENT_STROKE_RANGE',
  SHOW_LINE = 'CONTROLS/SHOW_LINE',
  HIDE_LINE = 'CONTROLS/HIDE_LINE',
  ADD_TIMER = 'CONTROLS/ADD_TIMER',
  REMOVE_TIMER = 'CONTROLS/REMOVE_TIMER',
}

export function clearControls(): ClearControlsAction {
  return {
    type: CONTROLS_ACTION_TYPES.CLEAR_CONTROLS,
  };
}

export function setCurrentDistance(distance: number): SetCurrentDistanceAction {
  return {
    type: CONTROLS_ACTION_TYPES.SET_CURRENT_DISTANCE,
    payload: { currentDistance: distance ?? 0 },
  };
}

export function setCurrentStrokeRange(sr: string): SetCurrentStrokeRangeAction {
  return {
    type: CONTROLS_ACTION_TYPES.SET_CURRENT_STROKE_RANGE,
    payload: { sr: sr },
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

export function removeTimer(id: number): RemoveTimerAction {
  return {
    type: CONTROLS_ACTION_TYPES.REMOVE_TIMER,
    payload: { id: id },
  };
}

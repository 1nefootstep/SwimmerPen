import { CONTROLS_ACTION_TYPES } from '../actions/controls.actions';
import {
  ControlsActionTypes,
  SetCurrentDistanceAction,
} from '../types';

export type ControlsInfo = {
  currentDistance: number;
};

function initState(): ControlsInfo {
  return {
    currentDistance: 0,
  };
}

const initialState: ControlsInfo = initState();

export function controlsReducer(
  state: ControlsInfo = initialState,
  action: ControlsActionTypes
): ControlsInfo {
  switch (action.type) {
    case CONTROLS_ACTION_TYPES.SET_CURRENT_DISTANCE: {
      const { payload } = action as SetCurrentDistanceAction;
      const { currentDistance } = payload;
      return {
        ...state,
        currentDistance: currentDistance,
      };
    }
    default:
      return state;
  }
}

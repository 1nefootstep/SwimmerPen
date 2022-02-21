import { CONTROLS_ACTION_TYPES } from '../actions/controls.actions';
import {
  AddTimerAction,
  ControlsActionTypes,
  RemoveTimerAction,
  SetCurrentDistanceAction,
  SetCurrentStrokeRangeAction,
} from '../types';

export type ControlsInfo = {
  currentDistance: number;
  currentSr: string;
  isLineVisible: boolean;
  timers: Array<number>;
};

function initState(): ControlsInfo {
  return {
    currentDistance: 0,
    currentSr: '',
    isLineVisible: false,
    timers: [],
  };
}

const initialState: ControlsInfo = initState();

export function controlsReducer(
  state: ControlsInfo = initialState,
  action: ControlsActionTypes
): ControlsInfo {
  switch (action.type) {
    case CONTROLS_ACTION_TYPES.CLEAR_CONTROLS: {
      return initState();
    }
    case CONTROLS_ACTION_TYPES.SET_CURRENT_DISTANCE: {
      const { payload } = action as SetCurrentDistanceAction;
      const { currentDistance } = payload;
      return {
        ...state,
        currentDistance: currentDistance,
      };
    }
    case CONTROLS_ACTION_TYPES.SHOW_LINE: {
      return {
        ...state,
        isLineVisible: true,
      };
    }
    case CONTROLS_ACTION_TYPES.HIDE_LINE: {
      return {
        ...state,
        isLineVisible: false,
      };
    }
    case CONTROLS_ACTION_TYPES.ADD_TIMER: {
      const { payload } = action as AddTimerAction;
      const { startTime } = payload;
      const timeAlreadyExist =
        state.timers.findIndex(time => time === startTime) !== -1;
      if (timeAlreadyExist) {
        return { ...state };
      }
      return {
        ...state,
        timers: [...state.timers, startTime],
      };
    }
    case CONTROLS_ACTION_TYPES.REMOVE_TIMER: {
      const { payload } = action as RemoveTimerAction;
      const { startTime } = payload;
      const index = state.timers.findIndex(time => time === startTime);
      if (index !== -1) {
        return { ...state, timers: state.timers.filter(t => t !== startTime) };
      }
      return {
        ...state,
      };
    }
    case CONTROLS_ACTION_TYPES.SET_CURRENT_STROKE_RANGE: {
      const { payload } = action as SetCurrentStrokeRangeAction;
      const { sr } = payload;
      return { ...state, currentSr: sr };
    }
    default:
      return state;
  }
}
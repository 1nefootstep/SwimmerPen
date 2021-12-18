import { CONTROLS_ACTION_TYPES } from '../actions/controls.actions';
import {
  AddTimerAction,
  ControlsActionTypes,
  RemoveTimerAction,
  SetCurrentDistanceAction,
  // SetLinePointsAction,
  // XYCoordinate,
} from '../types';

export type ControlsInfo = {
  currentDistance: number;
  isLineVisible: boolean;
  timers: Array<number>;
  // savedPointsLocation: { p1: XYCoordinate; p2: XYCoordinate };
};

function initState(): ControlsInfo {
  return {
    currentDistance: 0,
    isLineVisible: false,
    timers: [],
    // savedPointsLocation: { p1: { x: 100, y: 100 }, p2: { x: 150, y: 150 } },
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
    // case CONTROLS_ACTION_TYPES.SET_LINE_POINTS: {
    //   const { payload } = action as SetLinePointsAction;
    //   const { points } = payload;
    //   return {
    //     ...state,
    //     savedPointsLocation: { p1: points.p1, p2: points.p2 },
    //   };
    // }
    default:
      return state;
  }
}

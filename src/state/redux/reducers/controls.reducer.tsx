import { CONTROLS_ACTION_TYPES } from '../actions/controls.actions';
import {
  AddTimerAction,
  ControlsActionTypes,
  EditTimerAction,
  RemoveTimerAction,
  SetCurrentDistanceAction,
  SetCurrentStrokeRangeAction,
} from '../types';

export interface Timer {
  id: number;
  startTime: number;
}

export type ControlsInfo = {
  currentDistance: number;
  currentSr: string;
  isLineVisible: boolean;
  annotationDoneAlertNonce: number;
  timers: Array<Timer>;
};

function initState(): ControlsInfo {
  return {
    currentDistance: 0,
    currentSr: '',
    isLineVisible: false,
    annotationDoneAlertNonce: 0,
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
      const id =
        state.timers.reduce((prev, next) => Math.max(prev, next.id), -1) + 1;
      return {
        ...state,
        timers: state.timers.concat({ id: id, startTime: startTime }),
      };
    }
    case CONTROLS_ACTION_TYPES.EDIT_TIMER: {
      const { payload } = action as EditTimerAction;
      const { id, startTime } = payload;
      return {
        ...state,
        timers: state.timers.map(e => {
          if (e.id === id) {
            return { id: id, startTime: startTime };
          }
          return e;
        }),
      };
    }
    case CONTROLS_ACTION_TYPES.REMOVE_TIMER: {
      const { payload } = action as RemoveTimerAction;
      const { id } = payload;
      return { ...state, timers: state.timers.filter(t => t.id !== id) };
    }
    case CONTROLS_ACTION_TYPES.SET_CURRENT_STROKE_RANGE: {
      const { payload } = action as SetCurrentStrokeRangeAction;
      const { sr } = payload;
      return { ...state, currentSr: sr };
    }
    case CONTROLS_ACTION_TYPES.SHOW_ANNOTATION_DONE_ALERT: {
      return {
        ...state,
        annotationDoneAlertNonce:
          state.annotationDoneAlertNonce + 1,
      };
    }
    default:
      return state;
  }
}

import { ModeActionTypes, UpdateModeAction } from '../types';
import { MODE_ACTION_TYPE } from '../actions';
import { PoolDistance } from '../../AKB/AnnotationKnowledgeBank';

export interface ModeState {
  poolDistance: PoolDistance;
  modeIndex: number;
}

const initialState: ModeState = {
  poolDistance: PoolDistance.D50m,
  modeIndex: 0,
};

export function modeReducer(
  state: ModeState = initialState,
  action: ModeActionTypes
): ModeState {
  switch (action.type) {
    case MODE_ACTION_TYPE.RESET_MODE:
      return initialState;
    case MODE_ACTION_TYPE.UPDATE_MODE:
      const {type, payload} = (action as UpdateModeAction);
      return {
        poolDistance: payload.poolDistance,
        modeIndex: payload.modeIndex,
      };
    default:
      return state;
  }
}

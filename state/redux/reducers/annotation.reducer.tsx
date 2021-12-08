import {
  AnnotationActionTypes,
  AddAnnotationAction,
  AddStrokeCountAction,
  UpdateNameAction,
  UpdatePoolConfigAction,
  LoadAnnotationAction,
} from '../types';
import { ANNOTATION_ACTION_TYPES } from '../actions';
import {
  AnnotationInformation,
  PoolDistance,
} from '../../AKB/AnnotationKnowledgeBank';

function initState() {
  return {
    name: '',
    poolConfig: { poolDistance: PoolDistance.Unassigned, modeIndex: -1 },
    annotations: {},
    strokeCounts: {},
  };
}

const initialState: AnnotationInformation = initState();

export function annotationReducer(
  state: AnnotationInformation = initialState,
  action: AnnotationActionTypes
): AnnotationInformation {
  switch (action.type) {
    case ANNOTATION_ACTION_TYPES.CLEAR_ANNOTATION: {
      return initState();
    }
    case ANNOTATION_ACTION_TYPES.ADD_ANNOTATION: {
      const { payload } = action as AddAnnotationAction;
      const { distance, timestamp } = payload;
      const copiedAnnotations = { ...state.annotations };
      copiedAnnotations[distance] = timestamp;
      return {
        ...state,
        annotations: copiedAnnotations,
      };
    }
    case ANNOTATION_ACTION_TYPES.ADD_STROKE_COUNT: {
      const { payload } = action as AddStrokeCountAction;
      const { strokeRange, scWithTime } = payload;
      const copiedStrokeCounts = { ...state.strokeCounts };
      copiedStrokeCounts[strokeRange.toString()] = scWithTime;
      return {
        ...state,
        strokeCounts: copiedStrokeCounts,
      };
    }
    case ANNOTATION_ACTION_TYPES.UPDATE_NAME: {
      const { payload } = action as UpdateNameAction;
      const { name } = payload;
      return {
        ...state,
        name: name,
      };
    }
    case ANNOTATION_ACTION_TYPES.UPDATE_POOL_CONFIG: {
      const { payload } = action as UpdatePoolConfigAction;
      return {
        ...state,
        poolConfig: payload,
      };
    }
    case ANNOTATION_ACTION_TYPES.LOAD_ANNOTATION: {
      const { payload } = action as LoadAnnotationAction;
      return {
        ...payload,
      };
    }
    default:
      return state;
  }
}

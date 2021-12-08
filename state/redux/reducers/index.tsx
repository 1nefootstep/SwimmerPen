import { combineReducers } from 'redux';
// import { modeReducer } from './mode.reducer';
import { annotationReducer } from './annotation.reducer';

export const rootReducer = combineReducers({
  // mode: modeReducer,
  annotation: annotationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;


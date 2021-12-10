import { combineReducers } from 'redux';
import { annotationReducer } from './annotation.reducer';
import { recordingReducer } from './recording.reducer';

export const rootReducer = combineReducers({
  annotation: annotationReducer,
  recording: recordingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

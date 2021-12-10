import { combineReducers } from 'redux';
import { annotationReducer } from './annotation.reducer';
import { recordingReducer } from './recording.reducer';
import { videoReducer } from './video.reducer';

export const rootReducer = combineReducers({
  annotation: annotationReducer,
  recording: recordingReducer,
  video: videoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

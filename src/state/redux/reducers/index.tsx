import { combineReducers } from 'redux';
import { annotationReducer } from './annotation.reducer';
import { recordingReducer } from './recording.reducer';
import { videoReducer } from './video.reducer';
import { controlsReducer } from './controls.reducer';

export const rootReducer = combineReducers({
  annotation: annotationReducer,
  recording: recordingReducer,
  video: videoReducer,
  controls: controlsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

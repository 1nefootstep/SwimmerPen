import { AnnotationActionTypes } from './annotation.types';
import { RecordingActionTypes } from './recording.types';
import { VideoActionTypes } from './video.types';
import { ControlsActionTypes } from './controls.types';

export * from './annotation.types';
export * from './recording.types';
export * from './video.types';
export * from './controls.types';

export type AppActionTypes = AnnotationActionTypes | RecordingActionTypes | VideoActionTypes | ControlsActionTypes;
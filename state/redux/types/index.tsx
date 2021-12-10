import { AnnotationActionTypes } from './annotation.types';
import { RecordingActionTypes } from './recording.types';
import { VideoActionTypes } from './video.types';

export * from './annotation.types';
export * from './recording.types';
export * from './video.types';

export type AppActionTypes = AnnotationActionTypes | RecordingActionTypes | VideoActionTypes;
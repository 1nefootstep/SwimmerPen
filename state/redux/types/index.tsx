import { AnnotationActionTypes } from './annotation.types';
import { RecordingActionTypes } from './recording.types';

export * from './annotation.types';
export * from './recording.types';

export type AppActionTypes = AnnotationActionTypes | RecordingActionTypes;
import { Distance } from '../../AKB/Annotations';
import { UnixTime } from '../../UnixTime';

export type StartRecordingAction = {
  type: string;
  payload: { startRecordTime: UnixTime };
};

export type RecordingActionTypes = StartRecordingAction;

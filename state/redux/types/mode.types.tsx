import { PoolDistance } from '../../AKB/AnnotationKnowledgeBank';

interface ModeInterface {
  poolDistance: PoolDistance;
  modeIndex: number;
}

export type UpdateModeAction = {
  type: string;
  payload: ModeInterface;
}

export type ResetModeAction = {
  type: string;
}

export type ModeActionTypes = ResetModeAction | UpdateModeAction;

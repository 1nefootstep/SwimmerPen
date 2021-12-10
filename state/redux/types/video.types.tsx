import { AVPlaybackStatus } from "expo-av";

export type UpdateStatusAction = {
  type: string;
  payload: { status: AVPlaybackStatus };
};

export type VideoActionTypes = UpdateStatusAction;

import { Video } from 'expo-av';
import { RefObject } from 'react';

let _video: RefObject<Video>;

export function setVideo(videoRef: RefObject<Video>) {
  _video = videoRef;
}

export function play() {
  if (_video.current) {
    const v = _video.current;
    v.playAsync();
  }
}

export function pause() {
  if (_video.current) {
    const v = _video.current;
    v.pauseAsync();
  }
}

export async function loadVideo(uri: string): Promise<boolean> {
  if (_video.current) {
    const v = _video.current;
    const videoStatus = await v.getStatusAsync();
    if (videoStatus.isLoaded) {
      try {
        await v.unloadAsync();
      } catch (e) {
        console.log(`Error at unloadAsync: ${e}`);
        return false;
      }
    }
    try {
      await v.loadAsync({ uri: uri });
    } catch (e) {
      console.log(`Error at loadAsync: ${e}`);
      return false;
    }
    return true;
  }
  return false;
}

export function seek(positionMillis: number) {
  if (_video.current) {
    const v = _video.current;
    v.setPositionAsync(positionMillis);
  }
}

export type GetPositionResult =
  | {
      isSuccessful: true;
      positionMillis: number;
    }
  | {
      isSuccessful: false;
    };

export async function getPosition(): Promise<GetPositionResult> {
  if (_video.current) {
    const v = _video.current;
    const status = await v.getStatusAsync();
    if (status.isLoaded) {
      return { isSuccessful: true, positionMillis: status.positionMillis };
    }
    return { isSuccessful: false };
  }
  return { isSuccessful: false };
}

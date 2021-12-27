import { Video } from 'expo-av';
import { RefObject } from 'react';

let _video: RefObject<Video>;
let _seekInfo = {
  isSeeking: false,
  seekBuffer: 0,
};
// let _isSeeking: boolean = false;
// let _seekBuffer = {};

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
      console.log(`Error at loadAsync while loading ${uri}: ${e}`);
      return false;
    }
    return true;
  }
  return false;
}

export function seek(positionMillis: number | undefined) {
  if (positionMillis === undefined) {
    return;
  }
  if (_video.current) {
    if (!_seekInfo.isSeeking) {
      _seekInfo.isSeeking = true;
      console.log(`Seeking to ${positionMillis}`);
      const v = _video.current;
      v.setPositionAsync(positionMillis, {
        toleranceMillisAfter: 0,
        toleranceMillisBefore: 0,
      })
        .then(status => {
          if (_seekInfo.seekBuffer !== 0) {
            const copiedBuffer = _seekInfo.seekBuffer;
            _seekInfo.seekBuffer = 0;
            seek(copiedBuffer);            
          }
        })
        .catch(e => console.log(`error: ${e}`))
        .finally(() => {
          _seekInfo.isSeeking = false;
        });
    } else {
      _seekInfo.seekBuffer = positionMillis;
    }
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

import { Video } from 'expo-av';
import { RefObject } from 'react';
import { showTimeForDuration } from '../../components/annotator/Controls/VideoProgressBar/ShowTime';
import { AppDispatch, updateVideoStatus } from '../redux';
import { getStartOfFrameGivenTime } from '../StatisticsCalculator';

let _video: RefObject<Video>;
let _seekInfo = {
  isSeeking: false,
  seekBuffer: 0,
};

export function setVideo(videoRef: RefObject<Video>) {
  _video = videoRef;
}

export function play(dispatch: AppDispatch) {
  // console.log(`VideoService: play`);
  if (_video.current) {
    const v = _video.current;
    v.playAsync().then(() => {
      _video.current?.getStatusAsync().then(e => {
        if (e.isLoaded) {
          dispatch(
            updateVideoStatus({
              isPlaying: e.isPlaying,
              positionMillis: e.positionMillis,
            })
          );
        }
      });
    });
  }
}

export function pause(dispatch: AppDispatch, frames?: Array<number>) {
  // console.log(`VideoService: pause`);
  if (_video.current) {
    const v = _video.current;
    v.pauseAsync().then(() => {
      _video.current?.getStatusAsync().then(e => {
        if (e.isLoaded) {
          let toSeekTo = e.positionMillis - 1;
          if (frames !== undefined && frames.length !== 0) {
            toSeekTo = getStartOfFrameGivenTime(frames, e.positionMillis);
          }
          seek(toSeekTo, dispatch);
          // seek(e.positionMillis, dispatch);
          // dispatch(
          //   updateVideoStatus({
          //     isPlaying: e.isPlaying,
          //     positionMillis: e.positionMillis,
          //   })
          // );
        }
      });
    });
  }
}

export async function loadVideo(uri: string): Promise<boolean> {
  // console.log(`VideoService: load`);
  if (_video.current) {
    const v = _video.current;
    const videoStatus = await v.getStatusAsync();
    if (videoStatus.isLoaded) {
      try {
        await v.unloadAsync();
      } catch (e) {
        //console.log(`Error at unloadAsync: ${e}`);
        return false;
      }
    }
    try {
      await v.loadAsync({ uri: uri });
    } catch (e) {
      //console.log(`Error at loadAsync while loading ${uri}: ${e}`);
      return false;
    }
    return true;
  }
  return false;
}

export function seek(
  positionMillis: number | undefined,
  dispatch?: AppDispatch
) {
  // console.log(`VideoService: seek`);
  if (positionMillis === undefined) {
    return;
  }
  if (_video.current) {
    if (!_seekInfo.isSeeking) {
      _seekInfo.isSeeking = true;
      const v = _video.current;
      v.setPositionAsync(positionMillis, {
        toleranceMillisAfter: 0,
        toleranceMillisBefore: 0,
      })
        .then(() => {
          _seekInfo.isSeeking = false;
          if (_seekInfo.seekBuffer !== 0) {
            const copiedBuffer = _seekInfo.seekBuffer;
            _seekInfo.seekBuffer = 0;
            seek(copiedBuffer);
          }
        })
        .catch(e => console.log(`error: ${e}`));
      if (dispatch !== undefined) {
        showTimeForDuration(dispatch);
      }
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

export async function getPosition(
  dispatch?: AppDispatch
): Promise<GetPositionResult> {
  // console.log(`VideoService: getPosition`);
  if (_video.current) {
    const v = _video.current;
    const status = await v.getStatusAsync();
    if (dispatch !== undefined && status.isLoaded) {
      dispatch(
        updateVideoStatus({
          isLoaded: status.isLoaded,
          isPlaying: status.isPlaying,
          positionMillis: status.positionMillis,
          durationMillis: status.durationMillis,
          uri: status.uri,
        })
      );
    }
    if (status.isLoaded) {
      return { isSuccessful: true, positionMillis: status.positionMillis };
    }
    return { isSuccessful: false };
  }
  return { isSuccessful: false };
}

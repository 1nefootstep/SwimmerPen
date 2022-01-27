import React from 'react';
import { Icon, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../../../state/redux/hooks';
import * as VideoService from '../../../../state/VideoService';

export default function PlayPauseButton() {
  const videoStatus = useAppSelector(state => state.video.status);
  const isLoaded = videoStatus?.isLoaded ?? false;
  const isPlaying = (videoStatus?.isLoaded && videoStatus?.isPlaying) ?? false;
  const positionMillis =
    videoStatus !== null && videoStatus.isLoaded
      ? videoStatus.positionMillis
      : 0;

  return (
    <Button
      variant="unstyled"
      onPress={async () => {
        if (isLoaded) {
          if (isPlaying) {
            const currPos = positionMillis;
            await VideoService.pauseSync();
            VideoService.seek(currPos);
          } else {
            VideoService.play();
          }
        }
      }}
      isDisabled={!isLoaded}
      leftIcon={
        <Icon
          as={FontAwesome}
          name={isPlaying ? 'stop' : 'play'}
          size={7}
          color="muted.50"
        />
      }
    />
  );
}

import React from 'react';
import { Icon, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../../../state/redux/hooks';
import * as VideoService from '../../../../state/VideoService';

export default function PlayPauseButton() {
  const videoStatus = useAppSelector(state => state.video.status);
  const isLoaded = videoStatus?.isLoaded ?? false;
  const isPlaying = (videoStatus?.isLoaded && videoStatus?.isPlaying) ?? false;

  return (
    <Button
      variant="unstyled"
      onPress={() => {
        if (isLoaded) {
          isPlaying ? VideoService.pause() : VideoService.play();
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

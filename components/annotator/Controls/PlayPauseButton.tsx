import React from 'react';
import { Icon, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../../state/redux/hooks';
import * as VideoService from '../../../state/VideoService';

export default function PlayPauseButton() {
  const videoStatus = useAppSelector(state => state.video);
  const isLoaded = videoStatus.isLoaded;
  const isPlaying =
    videoStatus.status?.isLoaded && videoStatus.status.isPlaying;

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
          name={isPlaying ? 'stop' : 'start'}
          size={5}
          color="muted.50"
        />
      }
    />
  );
}

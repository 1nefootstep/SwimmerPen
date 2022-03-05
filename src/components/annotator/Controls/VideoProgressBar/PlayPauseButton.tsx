import React from 'react';
import { Icon, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';
import * as VideoService from '../../../../state/VideoService';

export default function PlayPauseButton() {
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector(state => state.video.isPlaying);

  return (
    <Button
      variant="unstyled"
      onPress={() => {
        if (isPlaying) {
          VideoService.pause(dispatch);
        } else {
          VideoService.play(dispatch);
        }
      }}
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

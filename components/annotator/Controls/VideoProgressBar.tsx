import React, { useState } from 'react';

import * as VideoService from '../../../state/VideoService';
import { Slider, Center, Box, useBreakpointValue } from 'native-base';
import { useAppSelector } from '../../../state/redux/hooks';
import { formatTimeFromPosition } from '../../../state/Util';
import PlayPauseButton from './PlayPauseButton';

export default function VideoProgressBar() {
  const annotations = useAppSelector(state => state?.annotation.annotations);
  const videoStatus = useAppSelector(state => state?.video.status);
  const positionMillis =
    videoStatus !== null && videoStatus.isLoaded
      ? videoStatus.positionMillis
      : 0;
  const durationMillis =
    videoStatus !== null && videoStatus.isLoaded
      ? videoStatus.durationMillis ?? 10000
      : 10000;
  const sliderWidth = useBreakpointValue({
    base: '80%',
    sm: '80%',
    md: '85%',
    lg: '90%',
  });
  const [isHoverTextVisible, setIsHoverTextVisible] = useState<boolean>(false);
  const [hoverText, setHoverText] = useState<string>('');
  return (
    <Box
      position="absolute"
      flexDir="row"
      bottom={0}
      my={5}
      w="100%"
      bgColor={`rgba(55, 55, 55, 0.4)`}
    >
      <PlayPauseButton />
      <Slider
        value={positionMillis}
        onChange={newPos => {
          setHoverText(formatTimeFromPosition(newPos));
          if (!isHoverTextVisible) {
            setIsHoverTextVisible(true);
          }
          VideoService.seek(newPos);
        }}
        onChangeEnd={newPos => {
          setIsHoverTextVisible(false);
        }}
        w={sliderWidth}
        sliderSize={8}
        thumbSize={5}
        minValue={0}
        maxValue={durationMillis}
        step={10}
      >
        <Slider.Track>
          <Slider.FilledTrack />
          {Array.from(Object.values(annotations)).map((e, i) => {
            const pct = ((e / durationMillis) * 100).toFixed(3);
            return (
              <Box
                borderWidth={1}
                borderColor="emerald.500"
                position="absolute"
                left={`${pct}%`}
                h="100%"
                w="1"
                bgColor="emerald.200"
              />
            );
          })}
          <Slider.Thumb borderWidth="0" bg="rose.500">
            <Center
              position="absolute"
              bottom={6}
              w={16}
              h={5}
              bgColor={
                isHoverTextVisible ? 'rgba(52, 52, 52, 0.8)' : 'transparent'
              }
            >
              {isHoverTextVisible ? hoverText : ''}
            </Center>
          </Slider.Thumb>
        </Slider.Track>
      </Slider>
    </Box>
  );
}

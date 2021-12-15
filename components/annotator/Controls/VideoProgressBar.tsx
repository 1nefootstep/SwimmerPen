import React, { useMemo, useState } from 'react';

import * as VideoService from '../../../state/VideoService';
import { Slider, Center, Box, useBreakpointValue, Row } from 'native-base';
import { useAppSelector } from '../../../state/redux/hooks';
import { formatTimeFromPosition } from '../../../state/Util';
import PlayPauseButton from './PlayPauseButton';
import Marks from './Marks';
import Hidden from '../../Hidden';

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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoverText, setHoverText] = useState<string>('00:00');
  const [v, setV] = useState<number>(0);

  return (
    <Row
      position="absolute"
      bottom={0}
      mb={6}
      w="100%"
      h="50"
      bg={`rgba(55, 55, 55, 0.33)`}
    >
      <PlayPauseButton />
      <Slider
        value={isDragging ? v : positionMillis}
        onChange={newPos => {
          setV(newPos);
          setHoverText(formatTimeFromPosition(newPos));
          if (!isDragging) {
            setIsDragging(true);
          }
          VideoService.pause();
          VideoService.seek(newPos);
        }}
        onChangeEnd={newPos => {
          setIsDragging(false);
        }}
        minValue={0}
        maxValue={durationMillis}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        w={sliderWidth}
        thumbSize={12}
        step={33}
      >
        <Slider.Track>
          <Slider.FilledTrack />
          <Marks annotations={annotations} durationMillis={durationMillis} />
        </Slider.Track>
        <Slider.Thumb bg="transparent">
          <Hidden isHidden={!isDragging}>
            <Center
              position="absolute"
              bottom={8}
              w={16}
              h={5}
              bgColor={'rgba(52, 52, 52, 0.8)'}
            >
              {hoverText}
            </Center>
          </Hidden>
        </Slider.Thumb>
      </Slider>
    </Row>
  );
}

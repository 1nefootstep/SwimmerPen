import React, { useState } from 'react';

import * as VideoService from '../../state/VideoService';
import { Slider, Center, Box } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';
import { formatTimeFromPosition } from '../../state/Util';

export default function VideoProgressBar({
  positionMillis = 0,
  videoLength = 10000,
}: {
  positionMillis: number;
  videoLength?: number;
}) {
  const annotations = useAppSelector(state => state?.annotation.annotations);

  const [isHoverTextVisible, setIsHoverTextVisible] = useState<boolean>(false);
  const [hoverText, setHoverText] = useState<string>('');
  return (
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
      sliderSize={8}
      thumbSize={5}
      minValue={0}
      maxValue={100}
      step={10}
    >
      <Slider.Track>
        <Slider.FilledTrack />
        {Array.from(Object.values(annotations)).map((e, i) => {
          const pct = ((e / videoLength) * 100).toFixed(3);
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
  );
}

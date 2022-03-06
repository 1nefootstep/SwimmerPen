import React, { useMemo, useState } from 'react';
import * as VideoService from '../../../../state/VideoService';
import { Slider, Center, useBreakpointValue, Row, Box } from 'native-base';
import { useAppDispatch, useAppSelector } from '../../../../state/redux/hooks';
import { formatTimeFromPosition } from '../../../../state/Util';
import PlayPauseButton from './PlayPauseButton';
import Marks from './Marks';
import Hidden from '../../../Hidden';
import { hideTime, showTime } from '../../../../state/redux';
import TimeDisplay from './TimeDisplay';
import FineControlBar from './FineControlBar';

export default function VideoProgressBar() {
  const dispatch = useAppDispatch();
  const annotations = useAppSelector(state => state.annotation.annotations);
  const isTimeVisible = useAppSelector(state => state.video.isTimeVisible);
  const positionMillis = useAppSelector(state => state.video.positionMillis);
  const durationMillis = useAppSelector(state => state.video.durationMillis);
  const sliderWidth = useBreakpointValue({
    base: '80%',
    sm: '80%',
    md: '85%',
    lg: '90%',
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const hoverText = useMemo(
    () => formatTimeFromPosition(positionMillis),
    [positionMillis]
  );
  const [v, setV] = useState<number>(0);

  const setIsDraggingAndShowTime = (b: boolean) => {
    setIsDragging(b);
    b ? dispatch(showTime()) : dispatch(hideTime());
  };

  return (
    <>
      <Row w="100%" style={{ height: 44 }}>
        <PlayPauseButton />
        <Slider
          value={isDragging ? v : positionMillis}
          onChange={newPos => {
            setV(newPos);
            if (!isDragging) {
              setIsDraggingAndShowTime(true);
            }
            VideoService.pause(dispatch);
            VideoService.seek(newPos);
          }}
          minValue={0}
          maxValue={durationMillis}
          onTouchStart={() => setIsDraggingAndShowTime(true)}
          onTouchEnd={() => setIsDraggingAndShowTime(false)}
          w={sliderWidth}
          thumbSize={12}
          step={33}
        >
          <Slider.Track>
            <Slider.FilledTrack />
            <Marks annotations={annotations} durationMillis={durationMillis} />
          </Slider.Track>
          <Slider.Thumb bg="transparent">
            <Hidden isHidden={!isTimeVisible}>
              <Center
                position="absolute"
                bottom={8}
                w={20}
                h={5}
                bgColor={'rgba(52, 52, 52, 0.8)'}
              >
                {hoverText}
              </Center>
            </Hidden>
          </Slider.Thumb>
        </Slider>
      </Row>
      <Row alignItems="center" pb={3}>
        <Box ml={2} mr={3}>
          <TimeDisplay />
        </Box>
        <Box flex={1} mr={2}>
          <FineControlBar />
        </Box>
      </Row>
    </>
  );
}

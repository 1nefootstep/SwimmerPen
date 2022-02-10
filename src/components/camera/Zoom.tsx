import React, { useState } from 'react';

import { Box, Slider, ZStack } from 'native-base';
import DashedLine from 'react-native-dashed-line';

interface ZoomProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  maxZoom: number;
}

export default function Zoom({ zoom, setZoom, maxZoom }: ZoomProps) {
  // const [x, setX] = useState<number>(0);
  return (
    <ZStack flex={1} alignItems="center" justifyContent="center">
      <Slider
        value={zoom}
        step={0.1}
        minValue={1}
        maxValue={maxZoom}
        size="lg"
        orientation="vertical"
        onChange={x => setZoom(x)}
      >
        <Slider.Track bgColor="transparent" />
        <Slider.Thumb zIndex={2} size={24} bg="transparent">
          <Box
            zIndex={2}
            w={8}
            h={1}
            _dark={{ bgColor: 'yellow.300' }}
            _light={{ bgColor: 'yellow.300' }}
          />
        </Slider.Thumb>
      </Slider>
      <DashedLine
        dashLength={3}
        dashGap={5}
        axis="vertical"
        dashThickness={10}
        style={{ flex: 1 }}
        dashStyle={{ backgroundColor: 'white' }}
      />
    </ZStack>
  );
}

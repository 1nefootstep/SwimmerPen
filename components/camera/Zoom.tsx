import React, { useState } from 'react';

import { Box, Slider, ZStack } from 'native-base';
import DashedLine from 'react-native-dashed-line';

interface ZoomProps {
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

// applies y = 1/(1+ (x/(1-x))^-3)
// this allows the zoom to be an s curve
// instead of just linear
function sCurve(x: number) {
  return 1 / (1 + (x / (1 - x)) ** -2.5);
}

export default function Zoom({ setZoom }: ZoomProps) {
  const [x, setX] = useState<number>(0);
  return (
    <ZStack flex={1} alignItems="center" justifyContent="center">
      <Slider
        value={x}
        step={0.02}
        minValue={0}
        maxValue={1}
        size="lg"
        orientation="vertical"
        onChange={x => {
          setX(x);
          setZoom(sCurve(x));
        }}
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

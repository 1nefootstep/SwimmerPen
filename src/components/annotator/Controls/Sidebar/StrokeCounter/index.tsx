import React from 'react';
import { Box } from 'native-base';

import SetStrokeTimeButton from './SetStrokeTimeButton';
import SelectStrokeRange from './SelectStrokeRange';
import SelectStrokeCount from './SelectStrokeCount';

export default function StrokeCounter() {
  return (
    <Box>
      <SelectStrokeRange />
      <SelectStrokeCount />
      <SetStrokeTimeButton />
    </Box>
  );
}

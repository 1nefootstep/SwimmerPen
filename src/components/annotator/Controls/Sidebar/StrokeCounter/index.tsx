import React from 'react';
import { Box, Center } from 'native-base';

import SetStrokeTimeButton from './SetStrokeTimeButton';
import SelectStrokeRange from './SelectStrokeRange';
import SelectStrokeCount from './SelectStrokeCount';
import SelectMode from '../../../../SelectMode';

export default function StrokeCounter() {
  return (
    <Box>
      <SelectStrokeRange />
      <SelectStrokeCount />
      <SetStrokeTimeButton />
      <Center mt={2}>
        <SelectMode needIsRecording={false} />
      </Center>
    </Box>
  );
}

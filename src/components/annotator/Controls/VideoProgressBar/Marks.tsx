import React from 'react';

import { Box } from 'native-base';
import { Annotations } from '../../../../state/AKB';

export default function Marks({
  annotations,
  durationMillis,
}: {
  annotations: Annotations;
  durationMillis: number;
}) {
  return (
    <>
      {Array.from(Object.values(annotations)).map((e, i) => {
        const pct = ((e / durationMillis) * 100).toFixed(3);
        return (
          <Box
            key={i}
            borderWidth={1}
            borderColor="rose.500"
            position="absolute"
            left={`${pct}%`}
            h="100%"
            w="1.5"
            bgColor="rose.200"
          />
        );
      })}
    </>
  );
}

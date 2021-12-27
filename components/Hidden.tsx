import React, { ReactElement } from 'react';
import { Box } from 'native-base';

interface HiddenProps {
  children: ReactElement | null;
  isHidden: boolean;
}

export default function Hidden({ children, isHidden }: HiddenProps) {
  if (isHidden) {
    return null;
    // return <Box w={0} h={0} 0opacity={0}>{children}</Box>;
  }
  return children;
}

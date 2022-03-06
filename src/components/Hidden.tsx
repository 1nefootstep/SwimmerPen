import React, { ReactNode } from 'react';
import { Box } from 'native-base';

interface HiddenProps {
  children: ReactNode | null;
  isHidden: boolean;
}

export default function Hidden({ children, isHidden }: HiddenProps) {
  if (isHidden) {
    return null;
  }
  return <>{children}</>;
}

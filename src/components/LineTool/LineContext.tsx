import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface LineContextInterface {
  p1X?: SharedValue<number>;
  p1Y?: SharedValue<number>;
  p2X?: SharedValue<number>;
  p2Y?: SharedValue<number>;
}

export const LineContext = React.createContext<LineContextInterface>({});

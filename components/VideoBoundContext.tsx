import React from 'react';

export interface VideoBoundContextInterface {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const VideoBoundContext =
  React.createContext<VideoBoundContextInterface>({
    x1: 0,
    y1: 0,
    x2: 200,
    y2: 230,
  });

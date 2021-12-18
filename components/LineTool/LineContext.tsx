import React from "react";

export interface LineContextInterface {
  p1X?: number;
  p1Y?: number;
  p2X?: number;
  p2Y?: number;
  setP1X?: React.Dispatch<React.SetStateAction<number>>;
  setP1Y?: React.Dispatch<React.SetStateAction<number>>;
  setP2X?: React.Dispatch<React.SetStateAction<number>>;
  setP2Y?: React.Dispatch<React.SetStateAction<number>>;
}

export const LineContext = React.createContext<LineContextInterface>({});

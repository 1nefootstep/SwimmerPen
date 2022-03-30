import React from 'react';
import { DPSStatistic } from '../../state/StatisticsCalculator';
import MultiLineChart from './MultiLineChart';
import { dpsDataToGeneral } from './ResultUtil';

export interface DPSChartProps {
  nameAndDps: Array<{
    name: string;
    stats: Array<DPSStatistic>;
  }>;
  width?: number;
}

// const colors = [
//   (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
//   (opacity = 1) => `rgba(101, 163, 13, ${opacity})`,
//   (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
//   (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
// ];

export default function DPSChart({ nameAndDps, width }: DPSChartProps) {
  return (
    <MultiLineChart
      nameAndStats={dpsDataToGeneral(nameAndDps)}
      // colors={colors}
      lineType="Dist/stroke"
      unit={'m'}
      width={width}
    />
  );
}

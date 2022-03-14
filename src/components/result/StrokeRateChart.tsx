import React from 'react';
import { StrokeRateStatistic } from '../../state/StatisticsCalculator';
import MultiLineChart from './MultiLineChart';
import { srDataToGeneral } from './ResultUtil';

export interface StrokeRateChartProps {
  nameAndStrokeRates: Array<{
    name: string;
    stats: Array<StrokeRateStatistic>;
  }>;
  width?: number;
}

const colors = [
  (opacity = 1) => `rgba(101, 163, 13, ${opacity})`,
  (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
  (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
  (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
];

export default function StrokeRateChart({
  nameAndStrokeRates,
  width,
}: StrokeRateChartProps) {
  return (
    <MultiLineChart
      nameAndStats={srDataToGeneral(nameAndStrokeRates)}
      colors={colors}
      lineType="Stroke rate"
      unit={'st/min'}
      width={width}
    />
  );
}

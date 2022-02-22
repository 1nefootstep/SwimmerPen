import React from 'react';
import { StrokeRateStatistic } from '../../state/StatisticsCalculator';
import MultiLineChart from './MultiLineChart';

export interface StrokeRateChartProps {
  nameAndStrokeRates: Array<{
    name: string;
    stats: Array<StrokeRateStatistic>;
  }>;
}

const colors = [
  (opacity = 1) => `rgba(101, 163, 13, ${opacity})`,
  (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
  (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
  (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
];

export default function StrokeRateChart({
  nameAndStrokeRates,
}: StrokeRateChartProps) {
  return (
    <MultiLineChart
      nameAndStats={nameAndStrokeRates.map(e => ({
        name: e.name,
        stats: e.stats.map(i => ({
          startRange: i.startRange,
          endRange: i.endRange,
          stat: i.strokeRate,
        })),
      }))}
      colors={colors}
      lineType="Stroke rate"
      unit={'st/min'}
    />
  );
}

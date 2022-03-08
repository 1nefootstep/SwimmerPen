import React from 'react';
import { VelocityAtRangeStatistic } from '../../state/StatisticsCalculator';
import MultiLineChart from './MultiLineChart';

export interface VelocityChartProps {
  nameAndVelocities: Array<{
    name: string;
    stats: Array<VelocityAtRangeStatistic>;
  }>;
  width?: number;
}

const colors = [
  (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  (opacity = 1) => `rgba(101, 163, 13, ${opacity})`,
  (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
  (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
];

export default function VelocityChart({
  nameAndVelocities,
  width,
}: VelocityChartProps) {
  return (
    <MultiLineChart
      nameAndStats={nameAndVelocities.map(e => ({
        name: e.name,
        stats: e.stats.map(i => ({
          startRange: i.startRange,
          endRange: i.endRange,
          stat: i.velocity,
        })),
      }))}
      colors={colors}
      lineType="Velocity"
      unit={'m/s'}
      width={width}
    />
  );
}

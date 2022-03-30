import React from 'react';
import { StrokeCountStatistic } from '../../state/StatisticsCalculator';
import MultiLineChart from './MultiLineChart';
import { scDataToGeneral } from './ResultUtil';

export interface StrokeCountChartProps {
  nameAndStrokeCounts: Array<{
    name: string;
    stats: Array<StrokeCountStatistic>;
  }>;
}

// const colors = [
//   (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
//   (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
//   (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
//   (opacity = 1) => `rgba(101, 163, 13, ${opacity})`,
// ];

export default function StrokeCountChart({
  nameAndStrokeCounts,
}: StrokeCountChartProps) {
  return (
    <MultiLineChart
      nameAndStats={scDataToGeneral(nameAndStrokeCounts)}
      // colors={colors}
      lineType="Stroke count"
    />
  );
}

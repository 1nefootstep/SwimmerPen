import React, { useMemo } from 'react';
import { StrokeCountStatistic } from '../../state/StatisticsCalculator';
import GeneralLineChart from './GeneralLineChart';

export interface StrokeCountChartProps {
  strokeCounts: Array<StrokeCountStatistic>;
}

export default function StrokeCountChart({
  strokeCounts,
}: StrokeCountChartProps) {
  const data = useMemo(() => {
    const labels = strokeCounts.map(e => `${e.startRange}m - ${e.endRange}m`);
    const dataset = strokeCounts.map(e => e.strokeCount);
    return {
      labels: labels,
      datasets: [
        {
          data: dataset,
          color: (opacity = 1) => `rgba(2, 132, 199, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Stroke count'],
    };
  }, [strokeCounts]);

  return <GeneralLineChart data={data} />;
}

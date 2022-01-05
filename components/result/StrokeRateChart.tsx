import React, { useMemo } from 'react';
import { StrokeRateStatistic } from '../../state/StatisticsCalculator';
import GeneralLineChart from './GeneralLineChart';

export interface StrokeRateChartProps {
  strokeRates: Array<StrokeRateStatistic>;
}

export default function StrokeRateChart({ strokeRates }: StrokeRateChartProps) {
  const data = useMemo(() => {
    const labels = strokeRates.map(e => `${e.startRange}m - ${e.endRange}m`);
    const dataset = strokeRates.map(e => e.strokeRate);
    return {
      labels: labels,
      datasets: [
        {
          data: dataset,
          color: (opacity = 1) => `rgba(101, 163, 13, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Stroke rate'],
    };
  }, [strokeRates]);

  return <GeneralLineChart data={data} unit="stroke/min" />;
}

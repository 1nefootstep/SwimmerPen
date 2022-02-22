import React, { useMemo } from 'react';
import { VelocityAtRangeStatistic } from '../../state/StatisticsCalculator';
import GeneralLineChart from './GeneralLineChart';

export interface VelocityChartProps {
  velocities: Array<VelocityAtRangeStatistic>;
}

export default function VelocityChart({ velocities }: VelocityChartProps) {
  const data = useMemo(() => {
    const labels = velocities.map(e => `${e.startRange}m-${e.endRange}m`);
    const dataset = velocities.map(e => e.velocity);
    return {
      labels: labels,
      datasets: [
        {
          data: dataset,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Velocity'],
    };
  }, [velocities]);

  return <GeneralLineChart data={data} unit={'m/s'} />;
}

import React, { useMemo } from 'react';
import { DPSStatistic } from '../../state/StatisticsCalculator';
import GeneralLineChart from './GeneralLineChart';

export interface DPSChartProps {
  dps: Array<DPSStatistic>;
}

export default function DPSChart({ dps }: DPSChartProps) {
  const data = useMemo(() => {
    const labels = dps.map(e => `${e.startRange}m - ${e.endRange}m`);
    const dataset = dps.map(e => e.distancePerStroke);
    return {
      labels: labels,
      datasets: [
        {
          data: dataset,
          color: (opacity = 1) => `rgba(234, 88, 12, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Distance per stroke'],
    };
  }, [dps]);

  return <GeneralLineChart data={data} unit="m" />;
}

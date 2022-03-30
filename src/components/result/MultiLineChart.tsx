import React, { useMemo } from 'react';
import GeneralLineChart from './GeneralLineChart';

export interface MultiLineChartProps {
  nameAndStats: Array<{
    name: string;
    stats: Array<{ label: string; stat: number }>;
  }>;
  lineType: string;
  unit?: string;
  width?: number;
}

const colors = [
  (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  (opacity = 1) => `rgba(101, 163, 13, ${opacity})`,
  (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
  (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
];

export default function MultiLineChart({
  nameAndStats,
  lineType,
  unit,
  width,
}: MultiLineChartProps) {
  const data = useMemo(() => {
    const labels = nameAndStats.map(e => e.stats.map(i => i.label));
    const mainLabel = labels.reduce(
      (prev, curr) => (prev.length >= curr.length ? prev : curr),
      []
    );
    const toPick = labels.map(e => e.every(i => mainLabel.includes(i)));
    const legends = nameAndStats.filter((e, i) => toPick[i]).map(e => e.name);
    const datasets = nameAndStats
      .filter((e, i) => toPick[i])
      .map(e => e.stats.map(i => i.stat));
    return {
      labels: mainLabel,
      datasets: datasets.map((e, i) => ({
        data: e,
        color: colors[i % colors.length],
        strokeWidth: 2,
      })),
      legend: legends,
    };
  }, [nameAndStats, colors, lineType]);

  return (
    <GeneralLineChart
      chartName={lineType}
      width={width}
      data={data}
      unit={unit}
    />
  );
}

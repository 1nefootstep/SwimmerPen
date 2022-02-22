import React, { useMemo } from 'react';
import GeneralLineChart from './GeneralLineChart';

export interface MultiLineChartProps {
  nameAndStats: Array<{
    name: string;
    stats: Array<{ startRange: number; endRange: number; stat: number }>;
  }>;
  colors: Array<(opacity?: number) => string>;
  lineType: string;
  unit?: string;
}

export default function MultiLineChart({
  nameAndStats,
  colors,
  lineType,
  unit,
}: MultiLineChartProps) {
  const data = useMemo(() => {
    const labels = nameAndStats.map(e =>
      e.stats.map(i => `${i.startRange}m-${i.endRange}m`)
    );
    const mainLabel = labels.reduce(
      (prev, curr) => (prev.length >= curr.length ? prev : curr),
      []
    );
    const toPick = labels.map(e => e.every(i => mainLabel.includes(i)));
    const legends = nameAndStats
      .filter((e, i) => toPick[i])
      .map(e => `${lineType}(${e.name})`);
    const datasets = nameAndStats
      .filter((e, i) => toPick[i])
      .map(e => e.stats.map(i => i.stat));
    // const dataset = strokeCounts.map(e => e.strokeCount);
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

  return <GeneralLineChart data={data} unit={unit} />;
}

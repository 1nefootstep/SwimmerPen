import React, { useMemo } from 'react';
import { shortenText } from '../../state/Util';
import GeneralLineChart from './GeneralLineChart';

export interface MultiLineChartProps {
  nameAndStats: Array<{
    name: string;
    // stats: Array<{ startRange: number; endRange: number; stat: number }>;
    stats: Array<{ label: string; stat: number }>;
  }>;
  colors: Array<(opacity?: number) => string>;
  lineType: string;
  unit?: string;
  width?: number;
}

export default function MultiLineChart({
  nameAndStats,
  colors,
  lineType,
  unit,
  width,
}: MultiLineChartProps) {
  const data = useMemo(() => {
    const labels = nameAndStats.map(
      e => e.stats.map(i => i.label)
      // e.stats.map(i => `${i.startRange}m-${i.endRange}m`)
    );
    const mainLabel = labels.reduce(
      (prev, curr) => (prev.length >= curr.length ? prev : curr),
      []
    );
    const toPick = labels.map(e => e.every(i => mainLabel.includes(i)));
    const legends = nameAndStats.filter((e, i) => toPick[i])
    // .map(e => `${lineType}(${shortenText(e.name)})`);
    // .map(e => `${lineType}(${e.name})`);
    .map(e => e.name);
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

  return <GeneralLineChart chartName={lineType} width={width} data={data} unit={unit} />;
}

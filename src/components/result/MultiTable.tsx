import React, { useMemo } from 'react';
import { shortenText } from '../../state/Util';
import Table from './Table';

export interface MultiTableProps {
  nameAndStats: Array<{
    name: string;
    stats: Array<{ startRange: number; endRange: number; stat: number }>;
  }>;
  tableName: string;
  unit?: string;
}

export default function MultiTable({
  nameAndStats,
  tableName,
  unit,
}: MultiTableProps) {
  const data = useMemo(() => {
    const labels = nameAndStats.map(e =>
      e.stats.map(i => `${i.startRange}m-${i.endRange}m`)
    );
    const mainLabel = labels.reduce(
      (prev, curr) => (prev.length >= curr.length ? prev : curr),
      []
    );
    const toPick = labels.map(e => e.every(i => mainLabel.includes(i)));
    const headings = [{ label: tableName }].concat(
      nameAndStats
        .filter((e, i) => toPick[i])
        .map(e => ({
          label: `${shortenText(e.name, 4)}${
            unit !== undefined ? `(${unit})` : ''
          }`,
        }))
    );
    const datasets = nameAndStats
      .filter((e, i) => toPick[i])
      .map(e => e.stats.map(i => i.stat));
    const rows = mainLabel.map((e, i) => {
      let row = [{ label: e }];
      row = row.concat(
        datasets.map(data => ({ label: `${data[i].toFixed(1)}` }))
      );
      return row;
    });
    // const dataset = strokeCounts.map(e => e.strokeCount);
    return {
      headings: headings,
      rows: rows,
    };
  }, [nameAndStats, tableName, unit]);

  return (
    <Table
      style={{ paddingHorizontal: 48 }}
      title={data.headings}
      rows={data.rows}
    />
  );
}

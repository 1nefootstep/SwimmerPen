import React from 'react';
import { DataTable } from 'react-native-paper';
import { TableCell } from './TableCell';

interface TableRowProps {
  row: TableCell[];
  isHeader?: boolean;
}

export default function TableRow({ row, isHeader = false }: TableRowProps) {
  if (isHeader) {
    return (
      <DataTable.Header>
        {row.map(({ label, numeric }) => (
          <DataTable.Title numeric={numeric ?? false} key={label}>
            {label}
          </DataTable.Title>
        ))}
      </DataTable.Header>
    );
  }
  return (
    <DataTable.Row>
      {row.map(({ label, numeric }) => (
        <DataTable.Cell numeric={numeric ?? false} key={label}>
          {label}
        </DataTable.Cell>
      ))}
    </DataTable.Row>
  );
}

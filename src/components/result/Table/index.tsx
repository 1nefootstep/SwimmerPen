import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { DataTable } from 'react-native-paper';
import { TableCell } from './TableCell';
import TableRow from './TableRow';

/**
 * title array length and row array length expected to be the same
 */
interface TableProps {
  title: TableCell[];
  rows: TableCell[][];
  style?: StyleProp<ViewStyle>;
}

export default function Table({ title, rows, style }: TableProps) {
  return (
    <DataTable style={style}>
      <TableRow row={title} isHeader={true} />
      {rows.map((r, i) => (
        <TableRow row={r} key={i} />
      ))}
    </DataTable>
  );
}

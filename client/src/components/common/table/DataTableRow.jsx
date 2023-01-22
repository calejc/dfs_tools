import { TableCell, TableRow } from '@mui/material'
import '../../../App.css'
import React from 'react'

export default function DataTableRow({
  columns,
  row,
  onRowSelect = null,
  useCeiling = null,
  isLineupTable = false
}) {

  const click = (row) => {
    return onRowSelect ? onRowSelect(row) : void (0)
  }

  const rowValueInput = (column, player_row, isLineupTable) => {
    if (isLineupTable) {
      switch (column.field) {
        case 'remove':
        case 'roster_slot_id':
          return player_row
        case 'pts':
          return { row: player_row.value, projection: useCeiling ? 'ceiling' : 'base' }
        default:
          return player_row.value
      }
    } else {
      switch (column.field) {
        case 'pts':
          return { row: player_row, projection: useCeiling ? 'ceiling' : 'base' }
        default:
          return player_row
      }
    }
  }

  return <TableRow
    hover
    sx={onRowSelect ? { cursor: 'cell' } : {}}
    onClick={() => click(row)}
  >
    {columns.map((col, i) => {
      return <TableCell
        key={i}
        sx={col.cellStyle}
        {...col.props}
      >
        {col.valueGetter(rowValueInput(col, row, isLineupTable))}
      </TableCell>
    })}
  </TableRow>
}
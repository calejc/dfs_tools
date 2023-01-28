import { TableCell, TableRow } from '@mui/material'
import '../../../App.css'
import React from 'react'

const shouldReRender = (prev, next) => {
  /*
    Columns prop is not memoized and never has referential equality.
    Instead of trying to memoize the DATA_TABLE_COLUMNs,
      have opted for just checking the row data here.
  */
  return prev.row === next.row
}

export default React.memo(function DataTableRow({
  columns,
  row,
  onRowSelect = null,
  useCeiling = null,
  isLineupTable = false,
  removePlayer = () => void (0),
  setExposure = () => void (0),
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

  const fn = (col) => {
    switch (col.field) {
      case 'remove':
        return removePlayer
      case 'exclude':
      case 'lock':
      case 'max':
      case 'min':
        return setExposure
      default:
        return () => void (0)
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
        {col.valueGetter(rowValueInput(col, row, isLineupTable), fn(col))}
      </TableCell>
    })}
  </TableRow>

}, shouldReRender)

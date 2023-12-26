import { TableRow } from '@mui/material'
import React from 'react'
import DataTableCell from './DataTableCell'
import { useSelector } from 'react-redux'

const propsAreEqual = (prev, next) => prev.playerId === next.playerId

export default React.memo(function DataTableRow({
  columns,
  playerSelector,
  playerId,
  onRowSelect = null,
  useCeiling = null,
  isLineupTable = false,
}) {

  const row = useSelector(state => playerSelector(state, playerId))

  console.log('re-rendering datatable row', row)

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
    {columns.map((col) => {
      const rowValue = rowValueInput(col, row, isLineupTable)
      return <DataTableCell key={`${rowValue.id}-${col.field}`} value={col.value(rowValue)}>
        {col.renderCellContents(rowValue)}
      </DataTableCell>
    }
    )}
  </TableRow>

}, propsAreEqual)

import React from 'react'
import '../../../App.css'
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
} from '@mui/material'

export default function DataTable({
  columns,
  data,
  header,
  footer,
  tableStyle,
  onRowSelect = null,
  useCeiling = null,
  isLineupTable = false
}) {

  const styles = () => {
    return onRowSelect ? { cursor: 'cell' } : {}
  }

  const click = (row) => {
    return onRowSelect ? onRowSelect(row) : void (0)
  }

  const rowValueInput = (column, row, isLineupTable) => {
    if (isLineupTable) {
      switch (column.field) {
        case 'remove':
        case 'roster_slot_id':
          return row
        case 'pts':
          return { row: row.value, projection: useCeiling ? 'ceiling' : 'base' }
        default:
          return row.value
      }
    } else {
      switch (column.field) {
        case 'pts':
          return { row: row, projection: useCeiling ? 'ceiling' : 'base' }
        default:
          return row
      }
    }
  }

  return (
    <TableContainer sx={tableStyle} >
      <Table size='small'>
        <TableHead>
          {header}
        </TableHead>
        <TableBody>
          {data.map((row, i) => {
            return (
              <TableRow
                hover
                key={i}
                sx={styles()}
                onClick={() => click(row)}
              >
                {columns.map((col, i) => {
                  return (
                    <TableCell
                      key={i}
                      sx={col.cellStyle}
                      {...col.props}
                    >
                      {col.valueGetter(rowValueInput(col, row, isLineupTable))}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          {footer}
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
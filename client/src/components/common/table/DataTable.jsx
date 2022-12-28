import React from 'react'
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
} from '@mui/material'
import { useSelector } from 'react-redux'

export default function DataTable({ columns, data, header, footer, tableStyle, onRowSelect = null, isLineupTable = false }) {
  const useCeilingProjection = isLineupTable ? useSelector(state => state.lineup.useCeilingProjection) : undefined

  const styles = () => {
    return onRowSelect ? { cursor: 'cell' } : {}
  }

  const click = (row) => {
    return onRowSelect ? onRowSelect(row) : void (0)
  }

  const rowValueInput = (column, row) => {
    switch (column.field) {
      case 'remove':
      case 'roster_slot_id':
        return row
      case 'pts':
        return { row: row.value, projection: useCeilingProjection ? 'ceiling' : 'base' }
      default:
        return row.value
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
                      {col.valueGetter(isLineupTable ? rowValueInput(col, row) : row)}
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
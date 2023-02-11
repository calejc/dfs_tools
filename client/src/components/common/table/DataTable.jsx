import React from 'react'
import '../../../App.css'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableFooter,
} from '@mui/material'
import DataTableRow from './DataTableRow'

export const MIN_MAX = {
  MAX: 'max',
  MIN: 'min'
}

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

  return (
    <TableContainer sx={tableStyle} >
      <Table size='small'>
        <TableHead>
          {header}
        </TableHead>
        <TableBody>
          {data.map((row, i) => {
            return <DataTableRow
              key={i}
              row={row}
              columns={columns}
              onRowSelect={onRowSelect}
              useCeiling={useCeiling}
              isLineupTable={isLineupTable}
            />
          })}
        </TableBody>
        <TableFooter>
          {footer}
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
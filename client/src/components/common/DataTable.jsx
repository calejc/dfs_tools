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

export default function DataTable({ columns, data, header, footer, tableStyle, onRowSelect = null }) {

  const selectable = (row) => {
    return {
      sx: { cursor: 'cell' },
      onClick: () => onRowSelect(row)
    }
  }

  return (
    <TableContainer sx={tableStyle} >
      <Table size='small'>
        <TableHead>
          {header}
        </TableHead>
        <TableBody>
          {data.map(row => {
            return (
              <TableRow
                hover
                key={row.id}
                sx={{ cursor: 'cell' }}
                onClick={() => onRowSelect(row)}
              >
                {columns.map(col => {
                  return (
                    <TableCell
                      key={col.label}
                      sx={col.cellStyle}
                    >
                      {col.valueGetter(row)}
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
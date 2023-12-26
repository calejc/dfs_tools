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

export default function DataTable({
  columns,
  data,
  header,
  footer,
  tableStyle,
  playerSelector,
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
          {data.map((playerId, i) => {
            return <DataTableRow
              key={i}
              playerSelector={playerSelector}
              playerId={playerId}
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
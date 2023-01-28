import React, { useCallback } from 'react'
import '../../../App.css'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableFooter,
} from '@mui/material'
import DataTableRow from './DataTableRow'
import { useDispatch } from 'react-redux'
import { removeLineupPlayer } from '../../../state/lineup'
import { updatePlayer } from '../../../state/draftGroup'

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
  const dispatch = useDispatch()

  const removePlayer = useCallback((row) => {
    dispatch(removeLineupPlayer(row.value.id))
  }, [])

  const setExposure = useCallback((e, player, minMax = null, lock = false, exclude = false) => {
    const updated = { ...player }
    if (minMax) {
      updated[minMax] = e.target.value
    } else if (lock) {
      updated[MIN_MAX.MAX] = 100
      updated[MIN_MAX.MIN] = 100
    } else if (exclude) {
      updated[MIN_MAX.MAX] = 0
      updated[MIN_MAX.MIN] = 0
    }
    dispatch(updatePlayer(updated))
  }, [])

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
              removePlayer={removePlayer}
              setExposure={setExposure}
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
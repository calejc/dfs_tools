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
import { useEffect } from 'react'

// const shouldReRender = (prev, curr) => {
//   const newData = curr.data.map(x => x.id)
//   const allSamePlayers = prev.data.map(x => x.id).every(e => newData.includes(e))
//   console.log("same list of players? - ", allSamePlayers)
//   console.log("previous: ", prev.data)
//   console.log("new data: ", curr.data)
//   return allSamePlayers
//   return
// }
// React.memo(
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

  useEffect(() => {
    console.log("updated data")
  }, [data])

  return (
    <TableContainer sx={tableStyle} >
      <Table size='small'>
        <TableHead>
          {header}
        </TableHead>
        <TableBody>
          {data.map((row, i) => {
            return <DataTableRow
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
// , shouldReRender)
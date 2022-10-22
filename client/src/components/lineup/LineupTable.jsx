import React from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import prettifyDollarValue from '../../util/prettifyDollarValue'

export default function LineupTable() {
  const lineup = useSelector(state => state.lineup.value)

  const salaryLeft = () => {
    const salRemaining = 50000 - lineup.reduce((accum, player) => accum + (player.value.salary | 0), 0)
    return prettifyDollarValue(salRemaining.toString())
  }

  return (lineup.length > 0 && (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align='right' colSpan={3}>Salary: {salaryLeft()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>POS</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>POS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lineup.map((row, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value?.player?.full_name}</TableCell>
                <TableCell>{row.value?.salary}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ))
}
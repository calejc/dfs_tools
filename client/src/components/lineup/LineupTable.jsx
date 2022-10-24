import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import prettifyDollarValue from '../../util/prettifyDollarValue'
import CloseIcon from '@mui/icons-material/Close'
import { removeLineupPlayer } from '../../state/lineup'

export default function LineupTable() {
  const lineup = useSelector(state => state.lineup.value)
  const dispatch = useDispatch()

  const salaryLeft = () => {
    const salRemaining = 50000 - lineup.reduce((accum, player) => accum + (player.value.salary | 0), 0)
    return prettifyDollarValue(salRemaining.toString())
  }

  const onRemove = (id) => {
    dispatch(removeLineupPlayer(id))
  }

  return (lineup.length > 0 && (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align='right' colSpan={4}>Salary: {salaryLeft()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>POS</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>POS</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lineup.map((row, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value?.player?.full_name}</TableCell>
                <TableCell>{row.value?.salary}</TableCell>
                <TableCell
                  sx={{ lineHeight: '1px!important' }}
                >
                  {row.value?.player && (
                    <IconButton
                      color='error'
                      sx={{ padding: '0px!important', fontSize: '6px!important' }}
                      onClick={() => onRemove(row.value.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ))
}
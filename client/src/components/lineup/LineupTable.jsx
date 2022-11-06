import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import prettifyDollarValue from '../../util/prettifyDollarValue'
import CloseIcon from '@mui/icons-material/Close'
import { removeLineupPlayer } from '../../state/lineup'

export default function LineupTable() {
  const [useCeiling, setUseCeiling] = useState(true)
  const [totalLineupProjection, setTotalLineupProjection] = useState()
  const [totalLineupOwnership, setTotalLineupOwnership] = useState()
  const [lineupProductOwnership, setLineupProductOwnership] = useState()
  const lineup = useSelector(state => state.lineup.value)
  const dispatch = useDispatch()

  useEffect(() => {
    // TODO: this is disgusting
    setTotalLineupProjection(
      parseFloat(
        lineup.reduce((accum, player) => accum + (projectionValue(player.value) || 0), 0)
      ).toFixed(2)
    )
    setTotalLineupOwnership(
      parseFloat(
        lineup.reduce((accum, player) => accum + (Number(player.value.ownership) || 0), 0)
      ).toFixed(2)
    )
    const populatedValues = lineup.filter(p => p.value.ownership > 0)
    if (populatedValues.length > 0) {
      setLineupProductOwnership(
        parseFloat(parseFloat(
          populatedValues.slice(1).reduce((accum, player) => accum * (Number(player.value.ownership) / 100 || 0), populatedValues[0].value.ownership / 100)
        ) * Number(`100${"0".repeat(populatedValues.length)}`)).toFixed(2)
      )
    }
  }, [lineup, useCeiling])

  const totalSalaryLeft = () => {
    return 50000 - lineup.reduce((accum, player) => accum + (player.value.salary | 0), 0)
  }

  const salaryLeft = () => {
    return prettifyDollarValue(totalSalaryLeft().toString())
  }

  const salaryPerPlayerRemaining = () => {
    return lineup.find((roster_slot) => Object.keys(roster_slot.value).length === 0) ?
      prettifyDollarValue(
        (totalSalaryLeft() / lineup.filter((roster_slot) => Object.keys(roster_slot.value).length === 0).length).toString().split('.')[0]
      ) : "$0"
  }

  const onRemove = (id) => {
    dispatch(removeLineupPlayer(id))
  }

  const projectionValue = (player) => {
    // TODO: temporary, need to handle this in the API when persisting showdown projections
    const value = useCeiling ? player.ceiling : player.base
    if (player.roster_slot_id === 511) {
      return value ? Number(value * 1.5) : undefined
    } else {
      return value ? Number(value) : undefined
    }
  }

  return (lineup.length > 0 && (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow >
            <TableCell
              colSpan={3}
              sx={{ paddingBottom: '0px', padding: '2px 6px!important' }}
            >
              Remaining: {salaryLeft()}
            </TableCell>
            <TableCell
              align='right'
              colSpan={3}
              sx={{ paddingBottom: '0px', padding: '2px 6px!important' }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size='small'
                    checked={useCeiling}
                    onChange={() => setUseCeiling(!useCeiling)}
                  />
                }
                label='Ceiling'
                disableTypography
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ padding: '2px 6px!important' }}>POS</TableCell>
            <TableCell sx={{ padding: '2px 6px!important' }}>Player</TableCell>
            <TableCell sx={{ padding: '2px 6px!important' }}>Pts</TableCell>
            <TableCell sx={{ padding: '2px 6px!important' }}>pOwn</TableCell>
            <TableCell sx={{ padding: '2px 6px!important' }}>Sal</TableCell>
            <TableCell sx={{ padding: '2px 6px!important' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lineup.map((row, i) => {
            return (
              <TableRow key={i}>
                <TableCell sx={{ padding: '2px 6px!important' }}>{row.label}</TableCell>
                <TableCell sx={{ padding: '2px 6px!important' }}>{row.value?.player}</TableCell>
                <TableCell sx={{ padding: '2px 6px!important' }}>{projectionValue(row.value)}</TableCell>
                <TableCell sx={{ padding: '2px 6px!important' }}>{row.value?.ownership}</TableCell>
                <TableCell sx={{ padding: '2px 6px!important' }}>{row.value?.salary}</TableCell>
                <TableCell
                  sx={{ lineHeight: '1px!important', padding: '2px 6px!important' }}
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
          <TableRow sx={{ border: 'none!important' }}>
            <TableCell
              colSpan={2}
              sx={{ border: 'none!important', padding: '2px 6px!important' }}
            >
              Rem. / Player: {salaryPerPlayerRemaining()}
            </TableCell>
            <TableCell
              colSpan={1}
              sx={{ border: 'none!important', padding: '2px 6px!important' }}
            >
              {totalLineupProjection}
            </TableCell>
            <TableCell
              colSpan={1}
              sx={{ border: 'none!important', padding: '2px 6px!important' }}
            >
              {totalLineupOwnership} %
            </TableCell>
            <TableCell
              align='right'
              colSpan={2}
              sx={{ border: 'none!important', padding: '2px 6px!important' }}
            >
              {lineupProductOwnership} %
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ))
}
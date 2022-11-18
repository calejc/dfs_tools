import { TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import prettifyDollarValue from '../../util/prettifyDollarValue'

const CELL_STYLES = { border: 'none!important', padding: '2px 6px!important' }

export default function LineupTableFooter({ useCeilingProjection, totalSalaryLeft }) {
  const [totalLineupProjection, setTotalLineupProjection] = useState()
  const [totalLineupOwnership, setTotalLineupOwnership] = useState()
  const [lineupProductOwnership, setLineupProductOwnership] = useState()
  const lineup = useSelector(state => state.lineup.value)

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
  }, [lineup, useCeilingProjection])

  const salaryPerPlayerRemaining = () => {
    return lineup.find((roster_slot) => Object.keys(roster_slot.value).length === 0) ?
      prettifyDollarValue(
        (totalSalaryLeft / lineup.filter((roster_slot) => Object.keys(roster_slot.value).length === 0).length).toString().split('.')[0]
      ) : "$0"
  }

  const projectionValue = (player) => {
    // TODO: temporary, need to handle this in the API when persisting showdown projections
    const value = useCeilingProjection ? player.ceiling : player.base
    if (player.roster_slot_id === 511) {
      return value ? Number(value * 1.5) : undefined
    } else {
      return value ? Number(value) : undefined
    }
  }


  return <TableRow sx={{ border: 'none!important' }}>
    <TableCell
      colSpan={2}
      sx={CELL_STYLES}
    >
      Rem. / Player: {salaryPerPlayerRemaining()}
    </TableCell>
    <TableCell
      colSpan={1}
      sx={CELL_STYLES}
    >
      {totalLineupProjection}
    </TableCell>
    <TableCell
      colSpan={1}
      sx={CELL_STYLES}
    >
      {totalLineupOwnership} %
    </TableCell>
    <TableCell
      align='right'
      colSpan={2}
      sx={CELL_STYLES}
    >
      {lineupProductOwnership} %
    </TableCell>
  </TableRow>
}
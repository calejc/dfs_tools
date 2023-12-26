import { TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'

const CELL_STYLES = { border: 'none!important', padding: '2px 6px!important' }

export default function OptimizerLineupTableFooter({ lineup, useCeiling }) {
  const [totalLineupProjection, setTotalLineupProjection] = useState()
  const [totalLineupOwnership, setTotalLineupOwnership] = useState()
  const [lineupProductOwnership, setLineupProductOwnership] = useState()

  useEffect(() => {
    // TODO: this is disgusting
    setTotalLineupProjection(
      parseFloat(
        Object.values(lineup).reduce((accum, player) => accum + (useCeiling ? player.ceiling : player.base), 0)
      ).toFixed(2)
    )
    setTotalLineupOwnership(
      parseFloat(
        Object.values(lineup).reduce((accum, player) => accum + (Number(player.ownership) || 0), 0)
      ).toFixed(2)
    )
    const populatedValues = Object.values(lineup).filter(p => p.ownership > 0)
    if (populatedValues.length > 0) {
      setLineupProductOwnership(
        parseFloat(parseFloat(
          populatedValues.slice(1).reduce((accum, player) => accum * (Number(player.ownership) / 100 || 0), populatedValues[0].ownership / 100)
        ) * Number(`100${"0".repeat(populatedValues.length)}`)).toFixed(2)
      )
    }
  }, [lineup])

  return <TableRow sx={{ border: 'none!important' }}>
    <TableCell
      colSpan={3}
      sx={CELL_STYLES}
    >
      Product Own: {lineupProductOwnership} %
    </TableCell>
    <TableCell
      colSpan={1}
      sx={CELL_STYLES}
    >
      {totalLineupProjection}
    </TableCell>
    <TableCell
      align='right'
      colSpan={2}
      sx={CELL_STYLES}
    >
      {totalLineupOwnership} %
    </TableCell>
  </TableRow>
}
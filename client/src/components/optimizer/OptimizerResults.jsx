import { Grid } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import OptimizerLineupTable from './table/OptimizerLineupTable'

export default function OptimizerResults() {
  const lineups = useSelector(state => state.lineups.value)

  return <Grid justifyContent='center' container spacing={{ xs: 2, md: 4 }}>
    {lineups.map((x, i) => {
      return <Grid
        item
        key={i}
      >
        <OptimizerLineupTable
          lineup={x}
          sx={{ maxWidth: '400px!important' }}
        />
      </Grid>
    })}
  </Grid>
}
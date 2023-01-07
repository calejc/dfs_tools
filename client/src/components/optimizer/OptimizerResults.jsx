import { Grid } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import OptimizerLineupTable from './table/OptimizerLineupTable'
import OptimizerResultsExposureTable from './table/OptimizerResultsExposureTable'

export default function OptimizerResults() {
  const { value: lineups, exposure } = useSelector(state => state.lineups)
  const useCeiling = useSelector(state => state.draftGroup.parameters.useCeiling)

  return <Grid
    justifyContent='center'
    container
    columns={2}
  >
    <Grid item xs={9} container columnSpacing={5}>
      {lineups.map((x, i) => {
        return <Grid
          item
          key={i}
        >
          <OptimizerLineupTable
            lineup={x}
            useCeiling={useCeiling}
          />
        </Grid>
      })}
    </Grid>
    <Grid
      item
      xs={2}
      container
      paddingTop={2}
    >
      <OptimizerResultsExposureTable exposures={exposure} />
    </Grid>
  </Grid>
}
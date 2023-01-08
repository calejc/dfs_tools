import { Grid } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import CsvDownloadButton from '../common/CsvDownloadButton'
import OptimizerLineupTable from './table/OptimizerLineupTable'
import OptimizerResultsExposureTable from './table/OptimizerResultsExposureTable'

export default function OptimizerResults() {
  const { value: lineups, exposure } = useSelector(state => state.lineups)
  const selectedDraftGroup = useSelector(state => state.draftGroup.value)
  const useCeiling = useSelector(state => state.draftGroup.parameters.useCeiling)

  const filename = () => {
    return `dk-lineups-${selectedDraftGroup.id}.csv`
  }

  const isFlexPosition = (i) => {
    return i == 7
  }

  const csvData = () => {
    const headers = ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST']
    const rows = lineups.map(lineup => {
      return lineup.map((x, i) => {
        if (isFlexPosition(i)) {
          return x.flex_id
        } else {
          return x.id
        }
      })
    })

    rows.unshift(headers)
    return rows
  }

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
      {lineups.length > 0 && <>
        <Grid item xs={12}>
          <CsvDownloadButton
            data={csvData()}
            filename={filename()}
          />
          <OptimizerResultsExposureTable exposures={exposure} />
        </Grid>
      </>
      }
    </Grid>
  </Grid>
}
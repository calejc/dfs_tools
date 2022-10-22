import React from 'react'
import DraftGroupSelect from './DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'
import { Grid } from '@mui/material'
import LineupTable from './LineupTable'

export default function CreateLineup() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DraftGroupSelect />
      </Grid>
      <Grid item xs={8}>
        <PlayerTable />
      </Grid>
      <Grid item xs={4}>
        <LineupTable />
      </Grid>
    </Grid>
  )
}
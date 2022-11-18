import { Grid, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DATA_TABLE_COLUMN from '../common/DATA_TABLE_COLUMN'
import DraftGroupSelect from '../lineup/DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'

export default function Optimizer() {
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)
  const [tab, setTab] = useState(0)

  const COLUMNS = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.Team,
    DATA_TABLE_COLUMN.Opponent,
    DATA_TABLE_COLUMN.Salary,
    DATA_TABLE_COLUMN.BaseProjection,
    DATA_TABLE_COLUMN.CeilingProjection,
    DATA_TABLE_COLUMN.Ownership,
    DATA_TABLE_COLUMN.OptimalRate,
    DATA_TABLE_COLUMN.BoomRate,
    DATA_TABLE_COLUMN.MaxExposure,
    DATA_TABLE_COLUMN.MinExposure,
    DATA_TABLE_COLUMN.Exclude,
    DATA_TABLE_COLUMN.Lock
  ]

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DraftGroupSelect />
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tab} onChange={(e, i) => setTab(i)}>
          <Tab label='Pool' />
          <Tab label='Settings' />
        </Tabs>
        {tab === 0 &&
          <PlayerTable
          columns={COLUMNS}
          selectedDraftGroup={selectedDraftGroup}
          />
        }
      </Grid>
    </Grid>
  )
}
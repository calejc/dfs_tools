import { Grid, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearDraftGroup } from '../../state/draftGroup'
import DATA_TABLE_COLUMN from '../common/table/DATA_TABLE_COLUMN'
import DraftGroupSelect from '../common/DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'
import OptimizerSettings from './OptimizerSettings'

export default function Optimizer() {
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)
  const dispatch = useDispatch()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    dispatch(clearDraftGroup())
  }, [])

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

  const tabContent = () => {
    if (tab === 0) {
      return <PlayerTable
        columns={COLUMNS}
        selectedDraftGroup={selectedDraftGroup}
      />
    } else {
      return <OptimizerSettings />
    }
  }

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
        {tabContent()}
      </Grid>
    </Grid>
  )
}
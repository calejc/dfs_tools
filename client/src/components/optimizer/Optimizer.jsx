import { Button, Grid, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearDraftGroup } from '../../state/draftGroup'
import DATA_TABLE_COLUMN from '../common/table/DATA_TABLE_COLUMN'
import DraftGroupSelect from '../common/DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'
import OptimizerSettings from './OptimizerSettings'
import { optimizeLineups } from '../../state/lineups'
import REQUEST_STATUS from '../../state/apiBased/REQUEST_STATUS'
import OptimizerResults from './OptimizerResults'
import GameSelect from '../common/GameSelect'
import isShowdown from '../../util/isShowdownSlate'
import LoadingBox from '../common/LoadingBox'

export default function Optimizer() {
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)
  const status = useSelector(state => state.lineups.status)
  const dispatch = useDispatch()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    setTab(0)
  }, [selectedDraftGroup])

  useEffect(() => {
    dispatch(clearDraftGroup())
  }, [])

  const onRun = () => {
    setTab(2)
    dispatch(optimizeLineups())
  }

  const COLUMNS = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.Team,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.Salary,
    DATA_TABLE_COLUMN.BaseProjection,
    DATA_TABLE_COLUMN.CeilingProjection,
    DATA_TABLE_COLUMN.Ownership,
    DATA_TABLE_COLUMN.OptimalRate,
    DATA_TABLE_COLUMN.Projection,
    DATA_TABLE_COLUMN.MaxExposure,
    DATA_TABLE_COLUMN.MinExposure,
    DATA_TABLE_COLUMN.Exclude,
    DATA_TABLE_COLUMN.Lock
  ]

  const tabContent = () => {
    if (status === REQUEST_STATUS.IN_PROGRESS) {
      return <LoadingBox isLoading={true} />
    } else {
      switch (tab) {
        case 0:
          return <PlayerTable
            columns={COLUMNS}
            optoTable={true}
            selectedDraftGroup={selectedDraftGroup}
          />
        case 1:
          return <OptimizerSettings />
        case 2:
          return <OptimizerResults />
      }
    }
  }

  const showResultsTab = () => {
    return status !== REQUEST_STATUS.NOT_STARTED
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DraftGroupSelect />
      </Grid>
      {(selectedDraftGroup.id && !isShowdown(selectedDraftGroup)) && <Grid item xs={12}>
        <GameSelect />
      </Grid>}
      <Grid item xs={12} container>
        <Grid item xs={6}>
          <Tabs value={tab} onChange={(e, i) => setTab(i)}>
            <Tab label='Pool' />
            <Tab label='Settings' />
            {showResultsTab && <Tab label='Results' />}
          </Tabs>
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction='row'
          justifyContent='flex-end'
          sx={{ paddingRight: '20px' }}
        >
          <Grid item>
            <Button
              variant='outlined'
              onClick={onRun}
              disabled={!selectedDraftGroup.id}
            >
              Run
            </Button>
          </Grid>
        </Grid>
        {tabContent()}
      </Grid>
    </Grid>
  )
}
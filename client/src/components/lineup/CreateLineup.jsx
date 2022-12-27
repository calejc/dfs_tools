import React from 'react'
import DraftGroupSelect from '../common/DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'
import { Grid } from '@mui/material'
import LineupTable from './LineupTable'
import { useDispatch, useSelector } from 'react-redux'
import DATA_TABLE_COLUMN from '../common/table/DATA_TABLE_COLUMN'
import { useEffect } from 'react'
import { clearDraftGroup } from '../../state/draftGroup'
import GameSelect from '../common/GameSelect'
import isShowdown from '../../util/isShowdownSlate'

export default function CreateLineup() {
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(clearDraftGroup())
  }, [])

  const BASE_COLUMN_SET = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.Team,
    DATA_TABLE_COLUMN.Opponent,
    DATA_TABLE_COLUMN.Salary,
    DATA_TABLE_COLUMN.BaseProjection,
    DATA_TABLE_COLUMN.CeilingProjection,
    DATA_TABLE_COLUMN.Ownership
  ]

  const COLUMNS_FOR_CLASSIC_GAME_TYPE = [
    ...BASE_COLUMN_SET,
    DATA_TABLE_COLUMN.OptimalRate,
    DATA_TABLE_COLUMN.BoomRate
  ]

  const COLUMNS_FOR_SHOWDOWN_GAME_TYPE = [
    ...BASE_COLUMN_SET,
    DATA_TABLE_COLUMN.CaptainRate,
    DATA_TABLE_COLUMN.FlexRate
  ]

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DraftGroupSelect />
      </Grid>
      {(selectedDraftGroup.id && !isShowdown(selectedDraftGroup)) && <Grid item xs={12}>
        <GameSelect />
      </Grid>}
      <Grid item xs={8}>
        <PlayerTable
          columns={isShowdown() ? COLUMNS_FOR_SHOWDOWN_GAME_TYPE : COLUMNS_FOR_CLASSIC_GAME_TYPE}
          selectedDraftGroup={selectedDraftGroup}
          selectedDraftGroupId={selectedDraftGroup.id}
        />
      </Grid>
      <Grid item xs={4}>
        <LineupTable />
      </Grid>
    </Grid>
  )
}
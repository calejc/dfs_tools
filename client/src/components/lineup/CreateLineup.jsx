import React from 'react'
import DraftGroupSelect from './DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'
import { Grid } from '@mui/material'
import LineupTable from './LineupTable'
import { useSelector } from 'react-redux'
import DATA_TABLE_COLUMN from '../common/DATA_TABLE_COLUMN'

export default function CreateLineup() {
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)

  const BASE_COLUMN_SET = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.PlayerName,
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

  const isShowdown = () => {
    return selectedDraftGroup?.type === 'showdown'
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DraftGroupSelect />
      </Grid>
      <Grid item xs={8}>
        <PlayerTable
          defaultSort={DATA_TABLE_COLUMN.Salary}
          columns={isShowdown() ? COLUMNS_FOR_SHOWDOWN_GAME_TYPE : COLUMNS_FOR_CLASSIC_GAME_TYPE}
          selectedDraftGroup={selectedDraftGroup}
        />
      </Grid>
      <Grid item xs={4}>
        <LineupTable />
      </Grid>
    </Grid>
  )
}
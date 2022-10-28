import React from 'react'
import { useSelector } from 'react-redux'
import DataTable from '../common/DataTable'
import DATA_TABLE_COLUMN from '../common/DATA_TABLE_COLUMN'

export default function PlayerTable() {
  const { draftGroups, selectedDraftGroup } = useSelector(state => state.draftGroups)

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
    return draftGroups.find(dg => dg.id === selectedDraftGroup)?.type === 'showdown'
  }

  return (selectedDraftGroup && (
    <DataTable
      defaultSort={DATA_TABLE_COLUMN.Salary}
      columns={isShowdown() ? COLUMNS_FOR_SHOWDOWN_GAME_TYPE : COLUMNS_FOR_CLASSIC_GAME_TYPE}
      data={draftGroups.filter((x) => x.id === selectedDraftGroup)[0]}
    />
  ))
}
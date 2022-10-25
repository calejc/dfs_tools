import React from 'react'
import { useSelector } from 'react-redux'
import DataTable from '../common/DataTable'
import DATA_TABLE_COLUMN from '../common/DATA_TABLE_COLUMN'

export default function PlayerTable() {
  const { draftGroups, selectedDraftGroup } = useSelector(state => state.draftGroups)

  return (selectedDraftGroup && (
    <DataTable
      defaultSort={DATA_TABLE_COLUMN.Salary}
      columns={[DATA_TABLE_COLUMN.Position, DATA_TABLE_COLUMN.PlayerName, DATA_TABLE_COLUMN.Salary]}
      data={draftGroups.filter((x) => x.id === selectedDraftGroup)[0]}
    />
  ))
}
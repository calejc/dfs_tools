import React from 'react'
import { useSelector } from 'react-redux'
import prettifyDollarValue from '../../util/prettifyDollarValue'
import DATA_TABLE_COLUMN from '../common/table/DATA_TABLE_COLUMN'
import LineupTableFooter from './LineupTableFooter'
import DataTable from '../common/table/DataTable'
import LineupTableHeader from './LineupTableHeader'

export default function LineupTable() {
  const { value: lineup, useCeilingProjection: useCeiling } = useSelector(state => state.lineup)

  const COLS = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.Points,
    DATA_TABLE_COLUMN.SalaryShort,
    DATA_TABLE_COLUMN.Ownership,
    DATA_TABLE_COLUMN.RemovePlayer
  ]

  const totalSalaryLeft = () => {
    return 50000 - lineup.reduce((accum, player) => accum + (player.value.salary | 0), 0)
  }

  const salaryLeft = () => {
    return prettifyDollarValue(totalSalaryLeft().toString())
  }

  return (lineup.length > 0 && (
    <DataTable
      columns={COLS}
      data={lineup}
      footer={<LineupTableFooter totalSalaryLeft={totalSalaryLeft()} useCeilingProjection={useCeiling} />}
      header={<LineupTableHeader columns={COLS} useCeiling={useCeiling} salaryLeft={salaryLeft()} />}
      isLineupTable={true}
    />
  ))
}
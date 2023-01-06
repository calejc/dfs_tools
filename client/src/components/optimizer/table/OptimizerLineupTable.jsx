import { TableCell, TableRow } from '@mui/material'
import React from 'react'
import DataTable from '../../common/table/DataTable'
import DATA_TABLE_COLUMN from '../../common/table/DATA_TABLE_COLUMN'
import OptimizerLineupTableFooter from './OptimizerLineupTableFooter'

export default function OptimizerLineupTable({ lineup, useCeiling }) {
  const COLS = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.Team,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.Points,
    DATA_TABLE_COLUMN.SalaryShort,
    DATA_TABLE_COLUMN.Ownership,
  ]

  return (lineup.length > 0 && (
    <DataTable
      columns={COLS}
      data={lineup}
      footer={<OptimizerLineupTableFooter lineup={lineup} useCeiling={useCeiling} />}
      header={<TableRow><TableCell colSpan={6}></TableCell></TableRow>}
      tableStyle={{ maxWidth: '400px' }}
      useCeiling={useCeiling}
    />
  ))

}
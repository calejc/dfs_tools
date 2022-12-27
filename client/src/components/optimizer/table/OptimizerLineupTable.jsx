import { TableCell, TableRow } from '@mui/material'
import React from 'react'
import DataTable from '../../common/table/DataTable'
import DATA_TABLE_COLUMN from '../../common/table/DATA_TABLE_COLUMN'
import OptimizerLineupTableFooter from './OptimizerLineupTableFooter'

export default function OptimizerLineupTable({ lineup }) {
  const COLS = [
    DATA_TABLE_COLUMN.Position,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.CeilingProjection,
    DATA_TABLE_COLUMN.SalaryShort,
    DATA_TABLE_COLUMN.Ownership,
  ]

  return (lineup.length > 0 && (
    <DataTable
      columns={COLS}
      data={lineup}
      footer={<OptimizerLineupTableFooter lineup={lineup} />}
      header={<TableRow><TableCell colSpan={5}></TableCell></TableRow>}
      tableStyle={{ maxWidth: '400px' }}
    />
  ))

}
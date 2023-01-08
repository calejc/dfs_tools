import React from 'react'
import { Box, TableCell, TableRow, Toolbar, Typography, Paper } from '@mui/material'
import DATA_TABLE_COLUMN from '../../common/table/DATA_TABLE_COLUMN'
import DataTable from '../../common/table/DataTable'

export default function OptimizerResultsExposureTable({ exposures }) {
  const COLS = [
    DATA_TABLE_COLUMN.Team,
    DATA_TABLE_COLUMN.PlayerName,
    DATA_TABLE_COLUMN.Exposure
  ]

  const header = () => {
    return <TableRow>
      {COLS.map((c, i) => {
        return <TableCell colSpan={1} key={i}>
          {c.label}
        </TableCell>
      })}
    </TableRow>
  }

  return <Box component={Paper} sx={{ marginTop: '10px!important' }}>
    <Toolbar sx={{ maxHeight: '45px!important', minHeight: '45px!important' }}>
      <Typography
        variant='h6'
      >
        Exposure
      </Typography>
    </Toolbar>
    <DataTable
      columns={COLS}
      data={exposures}
      header={header()}
      footer={<></>}
    />
  </Box>
}
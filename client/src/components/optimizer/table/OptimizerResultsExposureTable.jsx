import React, { useEffect, useState } from 'react'
import { Box, TableCell, TableRow, Toolbar, Typography, Paper, Grid, Select, MenuItem, Checkbox, FormControl } from '@mui/material'
import DATA_TABLE_COLUMN from '../../common/table/DATA_TABLE_COLUMN'
import DataTable from '../../common/table/DataTable'
import { POSITIONS } from '../../../state/lineup'

export default function OptimizerResultsExposureTable({ exposures, isShowdown = false }) {
  const [options, setOptions] = useState([])
  const [filter, setFilter] = useState([])

  useEffect(() => {
    const options = Object.keys(POSITIONS).filter(p => positionalOptions().includes(Number(p))).map(p => POSITIONS[p])
    setOptions(options)
    setFilter(options)
  }, [])

  const positionalOptions = () => {
    return isShowdown ? [511, 512] : [66, 67, 68, 69, 71]
  }

  const filtered = () => {
    return exposures.filter(p => filter.map(f => f.rosterSlotId).includes(Number(p.rosterSlotId)))
  }

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
    <Toolbar sx={{ maxHeight: '45px!important', minHeight: '45px!important', paddingTop: '15px', marginBottom: '25px' }}>
      <Grid alignItems='center' container direction='row'>
        <Grid item xs={6}>
          <Typography
            variant='h6'
          >
            Exposure
          </Typography>
        </Grid>
        <Grid xs={12} container item>
          <FormControl>
            <Select
              sx={{width: '200px!important'}}
              multiple
              variant='standard'
              size='small'
              value={filter}
              renderValue={(selected) => selected.map(s => s.label).join(', ')}
              onChange={(e) => setFilter(e.target.value)}
            >
              {options.map(p => {
                return <MenuItem
                  key={p.rosterSlotId}
                  value={p}
                  size='small'
                >
                  <Checkbox size='small' checked={filter.includes(p)} />
                  {p.label}
                </MenuItem>
              }
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Toolbar>
    <DataTable
      columns={COLS}
      data={filtered()}
      header={header()}
      footer={<></>}
    />
  </Box>
}
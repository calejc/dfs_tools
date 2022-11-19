import { Checkbox, FormControlLabel, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setUseCeilingProjection } from '../../state/lineup'

const CELL_STYLES = { paddingBottom: '0px', padding: '2px 6px!important' }
export default function LineupTableHeader({ columns, useCeiling, salaryLeft }) {
  const dispatch = useDispatch()

  return <>
    <TableRow>
      <TableCell
        colSpan={3}
        sx={CELL_STYLES}
      >
        Remaining: {salaryLeft}
      </TableCell>
      <TableCell
        align='right'
        colSpan={3}
        sx={CELL_STYLES}
      >
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={useCeiling}
              onChange={() => dispatch(setUseCeilingProjection(!useCeiling))}
            />
          }
          label='Ceiling'
          disableTypography
        />
      </TableCell>
    </TableRow>
    <TableRow>
      {columns.map((c, i) => {
        return <TableCell
          key={i}
          sx={c.cellStyle}>
          {c.label}
        </TableCell>
      })}
    </TableRow>
  </>
}
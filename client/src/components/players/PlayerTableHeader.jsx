import { Checkbox, FormControlLabel, FormGroup, Tab, TableCell, TableRow, TableSortLabel, Tabs, TextField } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../App.css'
import { SORT_DIR } from '../../shared/CONSTANTS'
import { filter, query, showAll, sort } from '../../state/draftGroup'
import { POSITIONS } from '../../state/lineup'

export default function PlayerTableHeader({ columns }) {
  const dispatch = useDispatch()
  const { value: selectedDraftGroup, parameters } = useSelector(state => state.draftGroup)

  const onTabChange = (e, value) => {
    dispatch(filter(value))
  }

  const onSearch = (e) => {
    dispatch(query(e.target.value))
  }

  const isDesc = () => {
    return parameters.sortDir === SORT_DIR.DESCENDING
  }

  const onSort = (field) => {
    const sortDir = field === parameters.sortBy && isDesc() ? SORT_DIR.ASCENDING : SORT_DIR.DESCENDING
    dispatch(sort(field, sortDir))
  }

  const togglePlayersNotProjected = (e) => {
    dispatch(showAll(!e.target.checked))
  }

  const draftGroupPositionalTabs = () => {
    return Object.keys(POSITIONS).filter(k => POSITIONS[k].draftGroupType === selectedDraftGroup.type)
  }

  return <>
    <TableRow className='player-table-header-row'>
      <TableCell colSpan={columns.length - 6} padding='none'>
        <Tabs
          value={parameters.position}
          className='position-tabs-group'
          onChange={onTabChange}
        >
          <Tab label='ALL' className='position-tab' />
          {draftGroupPositionalTabs().map(p => {
            return <Tab key={p} value={p} label={POSITIONS[p].label} className='position-tab' />
          })}
        </Tabs>
      </TableCell>
      <TableCell padding='none' colSpan={3}>
        <FormGroup
          sx={{ lineHeight: '16px', padding: '2px 6px', fontSize: '10px!important' }}
        >
          <FormControlLabel
            sx={{ lineHeight: '16px!important', padding: '2px 6px', fontSize: '10px!important' }}
            label="Hide 0 proj"
            control={
              <Checkbox
                sx={{ padding: '2px 6px' }}
                size='small'
                checked={!parameters.showAll}
                onChange={togglePlayersNotProjected}
              />
            }
          />
        </FormGroup>
      </TableCell>
      <TableCell
        colSpan={3}
        padding='none'
        align='right'
      >
        <TextField
          hiddenLabel
          placeholder='Search'
          variant='standard'
          size='small'
          margin='none'
          onChange={onSearch}
        />
      </TableCell>
    </TableRow>
    <TableRow className='player-table-header-row'>
      {columns.map(col => (
        <TableCell
          key={col.field}
          sortDirection={(col.sortable && parameters.sortBy === col.field) ? parameters.sortDir : false}
          sx={{ padding: '2px 6px!important', lineHeight: '16px', fontWeight: 'bold' }}
        >
          {col.sortable ?
            <TableSortLabel
              active={parameters.sortBy === col.field}
              className={parameters.sortBy === col.field ? 'active-sort data-table-header' : 'data-table-header'}
              direction={parameters.sortBy === col.field ? parameters.sortDir : 'desc'}
              onClick={() => onSort(col.field)}
            >
              {col.label}
            </TableSortLabel> :
            <>
              {col.label}
            </>
          }
        </TableCell>
      ))}
    </TableRow>
  </>
}
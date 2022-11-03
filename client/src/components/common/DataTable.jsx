import React, { useEffect, useReducer, useState } from 'react'
import {
  Tabs,
  Tab,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  TableBody,
  TableFooter,
  TablePagination,
  TextField
} from '@mui/material'
import '../../App.css'
import { useDispatch, useSelector } from 'react-redux'
import { POSITIONS, setLineupPlayer } from '../../state/lineup'
import { ACTIONS, dataTableSortAndFilterReducer, DEFAULT_SORTING_AND_FILTERING_STATE, SORT_DIR } from './dataTableSortAndFilterReducer'
import { playerValueGetter } from './DATA_TABLE_COLUMN'

export default function DataTable({ columns, data, defaultSort, tabFilters = true }) {
  const dispatch = useDispatch()
  const [sortingAndFiltering, sortingAndFilteringDispatch] = useReducer(dataTableSortAndFilterReducer, DEFAULT_SORTING_AND_FILTERING_STATE(defaultSort.field))
  const [tableData, setTableData] = useState([])
  const lineup = useSelector(state => state.lineup.value)

  useEffect(() => {
    setSortedAndFilteredTableData()
  }, [sortingAndFiltering, lineup])

  useEffect(() => {
    sortingAndFilteringDispatch({ type: ACTIONS.RESET, payload: defaultSort.field })
  }, [data])

  const onSort = (field) => {
    const sortDir = field === sortingAndFiltering.sortBy && isDesc() ? SORT_DIR.ASCENDING : SORT_DIR.DESCENDING
    sortingAndFilteringDispatch({ type: ACTIONS.SORT, payload: { by: field, sortDir: sortDir } })
  }

  const onTabChange = (e, value) => {
    sortingAndFilteringDispatch({ type: ACTIONS.FILTER, payload: value })
  }

  const onSearch = (e) => {
    sortingAndFilteringDispatch({ type: ACTIONS.QUERY, payload: e.target.value })
  }

  const onRowsPerPageChange = (e) => {
    sortingAndFilteringDispatch({ type: ACTIONS.PER_PAGE, payload: { perPage: e.target.value, defaultSortBy: defaultSort.field } })
  }

  const onPageChange = (e, page) => {
    sortingAndFilteringDispatch({ type: ACTIONS.PAGE, payload: page })
  }

  const onPlayerSelect = (player) => {
    dispatch(setLineupPlayer(player))
    if (sortingAndFiltering.query !== '') {
      sortingAndFilteringDispatch({ type: ACTIONS.QUERY, payload: '' })
    }
  }

  const isDesc = () => {
    return sortingAndFiltering.sortDir === SORT_DIR.DESCENDING
  }

  const sorted = (filteredData) => {
    return filteredData.slice().sort((a, b) => {
      return isDesc() ?
        b[sortingAndFiltering.sortBy] - a[sortingAndFiltering.sortBy] :
        a[sortingAndFiltering.sortBy] - b[sortingAndFiltering.sortBy]
    })
  }

  const playerForFilter = (player) => {
    if (parseInt(sortingAndFiltering.filter) === 0) {
      return true
    }

    if (parseInt(sortingAndFiltering.filter) === 70) {
      return player.flex_id
    }

    return parseInt(sortingAndFiltering.filter) === parseInt(player.roster_slot_id)
  }

  const playerNotAlreadySelected = (p) => {
    return !lineup.map(s => s.value)?.includes(p)
  }

  const filteredPlayers = () => {
    return data.players.filter(p => {
      return playerNotAlreadySelected(p) && playerForFilter(p) && playerValueGetter(p).toUpperCase().includes(sortingAndFiltering.query)
    })
  }

  const setSortedAndFilteredTableData = () => {
    setTableData(sorted(filteredPlayers()))
  }

  const rowsForCurrPage = () => {
    return tableData.slice(
      sortingAndFiltering.page * sortingAndFiltering.perPage,
      sortingAndFiltering.page * sortingAndFiltering.perPage + sortingAndFiltering.perPage
    )
  }

  const draftGroupPositionalTabs = () => {
    return Object.keys(POSITIONS).filter(k => POSITIONS[k].draftGroupType === data.type)
  }

  return (
    <TableContainer sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderRadius: '5px' }} >
      <Table size='small'>
        <TableHead>
          <TableRow>
            {tabFilters && (
              <TableCell colSpan={columns.length - 3} padding='none'>
                <Tabs
                  value={sortingAndFiltering.filter}
                  className='position-tabs-group'
                  onChange={onTabChange}
                >
                  <Tab label='ALL' className='position-tab' />
                  {draftGroupPositionalTabs().map(p => {
                    return <Tab key={p} value={p} label={POSITIONS[p].label} className='position-tab' />
                  })}
                </Tabs>
              </TableCell>
            )}
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
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.field}
                sortDirection={(col.sortable && sortingAndFiltering.sortBy === col.field) ? sortingAndFiltering.sortDir : false}
                sx={{ padding: '2px 6px!important' }}
              >
                {col.sortable ?
                  <TableSortLabel
                    active={sortingAndFiltering.sortBy === col.field}
                    className={sortingAndFiltering.sortBy === col.field ? 'active-sort data-table-header' : 'data-table-header'}
                    direction={sortingAndFiltering.sortBy === col.field ? sortingAndFiltering.sortDir : 'desc'}
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
        </TableHead>
        <TableBody>
          {rowsForCurrPage().map(row => {
            return (
              <TableRow
                hover
                key={row.id}
                sx={{ cursor: 'cell' }}
                onClick={() => onPlayerSelect(row)}
              >
                {columns.map(col => {
                  return (
                    <TableCell
                      key={col.label}
                      sx={{ padding: '2px 6px!important' }}
                    >
                      {col.valueGetter(row)}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              rowsPerPage={sortingAndFiltering.perPage}
              count={tableData.length}
              page={sortingAndFiltering.page}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Table, TableContainer, TableHead, TableCell, TableRow, TableSortLabel, TableBody } from '@mui/material'
import '../../App.css'
import { ROSTER_SLOT_IDS } from '../../util/ROSTER_SLOT_IDS'
import { useDispatch } from 'react-redux'
import { setLineupPlayer } from '../../state/lineup'

const SORT_DIR = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
}

const TAB_INDICES = {
  0: 'ALL',
  1: 'QB',
  2: 'RB',
  3: 'WR',
  4: 'TE',
  5: 'FLEX',
  6: 'DST'
}

export default function DataTable({ columns, data, defaultSort, tabFilters = true }) {
  const dispatch = useDispatch()
  const [sort, setSort] = useState({ by: defaultSort.field, dir: SORT_DIR.DESCENDING })
  const [tab, setTab] = useState(0)
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    setSortedAndFilteredTableData()
  }, [tab, sort])

  const onSort = (field) => {
    const sortDir = field === sort.by && isDesc() ? SORT_DIR.ASCENDING : SORT_DIR.DESCENDING
    setSort({ by: field, dir: sortDir })
  }

  const onTabChange = (e, value) => {
    setTab(value)
  }

  const isDesc = () => {
    return sort.dir === SORT_DIR.DESCENDING
  }

  const sorted = (filteredData) => {
    return filteredData.slice().sort((a, b) => {
      return isDesc() ?
        b[sort.by] - a[sort.by] :
        a[sort.by] - b[sort.by]
    })
  }

  const playersForPosition = () => {
    return data.filter(p => ROSTER_SLOT_IDS[p.roster_slot_id] === TAB_INDICES[tab])
  }

  const setSortedAndFilteredTableData = () => {
    setTableData(TAB_INDICES[tab] === 'ALL' ? sorted(data) : sorted(playersForPosition()))
  }

  const onPlayerSelect = (player) => {
    dispatch(setLineupPlayer(player))
  }

  return (
    <TableContainer sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderRadius: '5px' }} >
      <Table size='small'>
        <TableHead>
          {tabFilters && (
            <TableRow>
              <TableCell colSpan={columns.length} padding='none'>
                <Tabs
                  value={tab}
                  className='position-tabs-group'
                  onChange={onTabChange}
                >
                  <Tab label='ALL' className='position-tab' />
                  <Tab label='QB' className='position-tab' />
                  <Tab label='RB' className='position-tab' />
                  <Tab label='WR' className='position-tab' />
                  <Tab label='TE' className='position-tab' />
                  <Tab label='FLEX' className='position-tab' />
                  <Tab label='DST' className='position-tab' />
                </Tabs>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.field}
                sortDirection={(col.sortable && sort.by === col.field) ? sort.dir : false}
              >
                {col.sortable ?
                  <TableSortLabel
                    active={sort.by === col.field}
                    className={sort.by === col.field ? 'active-sort data-table-header' : 'data-table-header'}
                    direction={sort.by === col.field ? sort.dir : 'desc'}
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
          {tableData.map(row => {
            return (
              <TableRow
                hover
                key={row.id}
                sx={{ cursor: 'cell' }}
                onClick={() => onPlayerSelect(row)}
              >
                {columns.map(col => {
                  return (
                    <TableCell>
                      {col.valueGetter(row)}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
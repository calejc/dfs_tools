import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useLoading from '../../hooks/useLoading'
import REQUEST_STATUS from '../../state/apiBased/REQUEST_STATUS'
import DataTable from '../common/table/DataTable'
import LoadingBox from '../common/LoadingBox'
import PlayerTableHeader from './PlayerTableHeader'
import PlayerTablePagination from './PlayerTablePagination'
import { query, reset, setFiltered } from '../../state/draftGroup'
import { setLineupPlayer } from '../../state/lineup'
import { useCallback } from 'react'

const TABLE_STYLES = { border: '1px solid rgba(224, 224, 224, 1)', borderRadius: '5px' }

export default function PlayerTable({ columns, selectedDraftGroup, selectedDraftGroupId, optoTable = false }) {
  const dispatch = useDispatch()
  const { status, parameters, paginated } = useSelector(state => state.draftGroup)
  const { isLoading, loading, done } = useLoading()
  const lineup = useSelector(state => state.lineup.value)

  useEffect(() => {
    if (REQUEST_STATUS.IN_PROGRESS === status) {
      loading()
    } else {
      done()
    }
  }, [status])

  useEffect(() => {
    if (selectedDraftGroup) {
      dispatch(setFiltered(lineup))
    }
  }, [parameters, lineup])

  useEffect(() => {
    dispatch(reset())
  }, [selectedDraftGroupId])

  const onPlayerSelect = useCallback((player) => {
    dispatch(setLineupPlayer(player))
    if (parameters.query !== '') {
      dispatch(query(''))
    }
  }, [])

  if (status === REQUEST_STATUS.NOT_STARTED) {
    return <Typography margin='10px' variant='h6'>Please select a slate</Typography>
  }

  return (
    <>
      <LoadingBox isLoading={isLoading} />
      {(!isLoading && Object.keys(selectedDraftGroup).length > 0) && (
        <DataTable
          columns={columns}
          data={paginated}
          tableStyle={TABLE_STYLES}
          onRowSelect={!optoTable ? onPlayerSelect : null}
          header={<PlayerTableHeader columns={columns} optoTable={optoTable} />}
          footer={<PlayerTablePagination />}
        />
      )}
    </>
  )
}
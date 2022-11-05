import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useLoading from '../../hooks/useLoading'
import REQUEST_STATUS from '../../state/apiBased/REQUEST_STATUS'
import DataTable from '../common/DataTable'
import LoadingBox from '../common/LoadingBox'

export default function PlayerTable({ columns, defaultSort, selectedDraftGroup }) {
  const { status } = useSelector(state => state.draftGroup)
  const { isLoading, loading, done } = useLoading()

  useEffect(() => {
    if (REQUEST_STATUS.IN_PROGRESS === status) {
      loading()
    } else {
      done()
    }
  }, [status])

  if (status === REQUEST_STATUS.NOT_STARTED) {
    return <Typography margin='10px' variant='h6'>Please select a slate</Typography>
  }

  return (
    <>
      <LoadingBox isLoading={isLoading} />
      {(!isLoading && Object.keys(selectedDraftGroup).length > 0) && (
        <DataTable
          defaultSort={defaultSort}
          columns={columns}
          data={selectedDraftGroup}
        />
      )}
    </>
  )
}
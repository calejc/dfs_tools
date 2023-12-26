import { TablePagination, TableRow } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { page, PARAMETERS, perPage } from '../../state/draftGroup'

export default React.memo(function PlayerTablePagination() {
  console.log('re-rendering pagination')
  const { parameters, filtered } = useSelector(state => state.draftGroup)
  const dispatch = useDispatch()

  const onPageChange = (e, pageNumber) => {
    dispatch(page(pageNumber))
  }

  const onRowsPerPageChange = (e) => {
    dispatch(perPage(e.target.value))
  }

  return <TableRow>
    <TablePagination
      rowsPerPageOptions={[20, 50, 100]}
      rowsPerPage={parameters[PARAMETERS.PerPage.name]}
      count={filtered?.length}
      page={parameters[PARAMETERS.Page.name]}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </TableRow>
})
import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

export default function DataTable({ columns, data }) {

  return (
    <DataGrid
    columnBuffer={0}
      disableExtendRowFullWidth='true'
      density='compact'
      rows={data}
      columns={columns}
      pageSize={50}
      rowsPerPageOptions={[50]}
    />
  )
}
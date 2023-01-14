import { saveAs } from 'file-saver'
import { Button, Tooltip } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import React from 'react'

export default function CsvDownloadButton({ data, filename, tooltip }) {

  const download = () => {
    saveAs(new Blob([data.map(x => x.join(',')).join('\n')]), filename)
  }

  return <Tooltip title={tooltip}>
    <Button
      variant='outlined'
      size="small"
      onClick={download}
    >
      CSV&nbsp;<DownloadIcon fontSize='small' />
    </Button>
  </Tooltip>
}
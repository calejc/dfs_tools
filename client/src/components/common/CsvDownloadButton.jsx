import { saveAs } from 'file-saver'
import { Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import React from 'react'

export default function CsvDownloadButton({ data, filename }) {

  const download = () => {
    saveAs(new Blob([data.map(x => x.join(',')).join('\n')]), filename)
  }

  return <Button
    variant='outlined'
    size="small"
    onClick={download}
  >
    CSV&nbsp;<DownloadIcon fontSize='small' />
  </Button>
}
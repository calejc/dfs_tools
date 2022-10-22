import { Button, Grid, Icon, IconButton, Modal, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import postFileUpload from '../../api/postFileUpload'


const modalStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  p: 2,
}

export default function FileUploadModal({ open, onClose }) {
  const [file, setFile] = useState()

  const onSubmit = () => {
    console.log(file)
    postFileUpload(file)
  }

  useEffect(() => {
    console.log(file)
  }, [file])

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Paper sx={modalStyle}>
        <Grid
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Typography>Upload CSV Projections</Typography>
          </Grid>
          <Grid item>
            {file?.name}
            <Button
              sx={{marginLeft: '10px'}}
              variant='contained'
              color='info'
              component='label'
              htmlFor='file-upload'
              onClick={onSubmit}
            >
              Select File
              <input
                type='file'
                id='file-upload'
                onChange={(e) => setFile(e.target.files[0])}
                hidden
              />
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={!file}
              onClick={onSubmit}
              size='small'
            >
              <UploadIcon />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  )
}
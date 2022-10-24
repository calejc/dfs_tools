import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import UploadIcon from '@mui/icons-material/Upload'
import postFileUpload from '../../api/postFileUpload'
import toReadableDate from '../../util/toReadableDate'

const modalStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  p: 2,
}

export default function FileUploadModal({ open, onClose }) {
  const { draftGroups } = useSelector(state => state.draftGroups)
  const [file, setFile] = useState()
  const [source, setSource] = useState()
  const [draftGroup, setDraftGroup] = useState()
  const [error, setError] = useState()

  const onSubmit = () => {
    postFileUpload(file, source, draftGroup)
      .then(() => onClose())
      .catch((e) => setError(e))
  }

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
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography>Upload CSV Projections</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ minWidth: '120px' }}>
              <FormControl fullWidth size='small'>
                <InputLabel>Source</InputLabel>
                <Select
                  value={source}
                  label='Source'
                  onChange={(e) => setSource(e.target.value)}
                >
                  <MenuItem value={'etr'}>Establish The Run</MenuItem>
                  <MenuItem value={'rts'}>Run The Sims</MenuItem>
                  <MenuItem value={'ows'}>One Week Season</MenuItem>
                  <MenuItem value={'other'}>Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {draftGroups && (
            <Grid item xs={6}>
              <Box sx={{ minWidth: '120px' }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Slate</InputLabel>
                  <Select
                    value={draftGroup}
                    label='Slate'
                    onChange={(e) => setDraftGroup(e.target.value)}
                  >
                    {draftGroups.map(dg => {
                      return <MenuItem value={dg.id}>{`${toReadableDate(dg.start)} (${dg.games.length} games)`}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          )}
          <Grid item>
            {file?.name}
            <Button
              sx={{ margin: '10px' }}
              variant='contained'
              color='info'
              component='label'
              htmlFor='file-upload'
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
              disabled={!file || !source || !draftGroup}
              onClick={onSubmit}
              size='small'
            >
              <UploadIcon />
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity='error'>{error}</Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Modal>
  )
}
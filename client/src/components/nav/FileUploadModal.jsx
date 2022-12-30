import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Snackbar,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import UploadIcon from '@mui/icons-material/Upload'
import DownloadIcon from '@mui/icons-material/Download'
import postFileUpload from '../../api/postFileUpload'
import toReadableDate from '../../util/toReadableDate'
import { PROJECTION_SOURCE } from '../../shared/CONSTANTS'
import { saveAs } from 'file-saver'
import useLoading from '../../hooks/useLoading'
import { useEffect } from 'react'

const modalStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  p: 2,
}

export default function FileUploadModal({ open, onClose }) {
  const { value: draftGroups } = useSelector(state => state.draftGroups)
  const [file, setFile] = useState()
  const [source, setSource] = useState()
  const [draftGroup, setDraftGroup] = useState()
  const [error, setError] = useState()
  const { isLoading, loading, done } = useLoading()
  const [snackBarOpen, setSnackBarOpen] = useState()

  const onSubmit = () => {
    loading()
    postFileUpload(file, source, draftGroup)
      .then(() => {
        setSnackBarOpen
        done()
      })
      .catch((e) => {
        console.log(e)
        setError(true)
        done()
      })
  }

  useEffect(() => {
    if (error) {
      setSnackBarOpen(true)
    }
  }, [error])

  const downloadTemplate = () => {
    saveAs(
      new Blob([
        [[
          "ID",
          "Player",
          "Position",
          "Team",
          "Base",
          "Median",
          "Ceiling",
          "Value",
          "Boom Rate",
          "Optimal Rate",
          "pOwn", "CPT Rate",
          "FLEX Rate"
        ].join(',')].join('\n')
      ]),
      'Template.csv'
    )
  }

  const close = () => {
    setSnackBarOpen(false)
    setFile(undefined)
    setSource(undefined)
    setDraftGroup(undefined)
    setError(undefined)
    onClose()
  }

  return (
    <>
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
                    {Object.keys(PROJECTION_SOURCE).map(source => {
                      return <MenuItem
                        key={source}
                        value={source.toLowerCase()}
                      >
                        {PROJECTION_SOURCE[source]}
                      </MenuItem>
                    })}
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
                        return <MenuItem
                          sx={{ fontSize: '14px' }}
                          key={dg.id}
                          value={dg.id}
                        >
                          {`${toReadableDate(dg.start)} ${dg.suffix ? dg.suffix : 'Main'}`}
                        </MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            direction='row'
            justifyContent='flex-end'
            alignItems='center'
            columnSpacing={0}
            rowSpacing={2}
          >
            <Grid
              item
              xs={8}
              container
              direction='row'
              justifyContent='flex-end'
              alignItems='center'
            >
              <Grid
                item
                xs={7}
                sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              >
                {file?.name}
              </Grid>
              <Grid item xs={5}>
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
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="Download template">
                <Button
                  size='small'
                  disabled={source !== 'other'}
                  onClick={downloadTemplate}
                >
                  <DownloadIcon />
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Button
                sx={{ maxWidth: '25px!important' }}
                disabled={!file || !source || !draftGroup}
                onClick={onSubmit}
                size='small'
              >
                {isLoading ? <CircularProgress /> : <UploadIcon />}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Snackbar open={snackBarOpen} autoHideDuration={error ? 2000 : 1000} onClose={close}>
        {!error ?
          <Alert onClose={close} severity='success'>
            Projections uploaded successfully!
          </Alert> :
          <Alert onClose={close} severity='error'>
            Error occurred, please contact support.
          </Alert>
        }
      </Snackbar>
    </>
  )
}
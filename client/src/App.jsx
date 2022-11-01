import { CircularProgress, Container, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import CreateLineup from './components/lineup/CreateLineup'
import Navbar from './components/nav/Navbar'
import { fetchDraftGroupsData } from './state/draftGroups'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import REQUEST_STATUS from './state/apiBased/REQUEST_STATUS'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  const dispatch = useDispatch()
  const { status, value } = useSelector(state => state.draftGroups)

  useEffect(() => {
    dispatch(fetchDraftGroupsData())
  }, [])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  const noLoadedData = () => {
    return !value || value.length === 0
  }

  const isLoading = () => {
    return [REQUEST_STATUS.NOT_STARTED, REQUEST_STATUS.IN_PROGRESS].includes(status) && noLoadedData()
  }

  const loaded = () => {
    return [REQUEST_STATUS.SUCCEEDED, REQUEST_STATUS.FAILED].includes(status)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container sx={{ height: '100vh', minWidth: '1400px', margin: 'auto' }}>
        {isLoading() && (
          <Grid
            width='100%'
            height='50%'
            container
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={12} textAlign='center'>
              <CircularProgress />
            </Grid>
          </Grid>
        )}
        {loaded() && (
          <Routes>
            <Route path='/lineup-builder' element={<CreateLineup />} />
            <Route path='/optimizer' element={<></>} />
          </Routes>
        )}
      </Container>
    </ThemeProvider>
  )
}
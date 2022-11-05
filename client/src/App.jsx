import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import CreateLineup from './components/lineup/CreateLineup'
import Navbar from './components/nav/Navbar'
import { fetchDraftGroupsData } from './state/draftGroups'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDraftGroupsData())
  }, [])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container sx={{ height: '100vh', minWidth: '1400px', margin: 'auto' }}>
        <Routes>
          <Route path='/lineup-builder' element={<CreateLineup />} />
          <Route path='/optimizer' element={<></>} />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}
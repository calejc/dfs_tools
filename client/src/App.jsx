import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import CreateLineup from './components/lineup/CreateLineup'
import Navbar from './components/nav/Navbar'
import { fetchDraftGroupsData } from './state/draftGroups'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDraftGroupsData())
  }, [])

  return (
    <>
      <Navbar />
      <Container sx={{ height: '100vh', width: '1400px', margin: 'auto' }}>
        <CreateLineup />
      </Container>
    </>
  )
}
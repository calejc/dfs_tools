import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import CreateLineup from './components/lineup/CreateLineup'
import { fetchDraftGroupsData } from './state/draftGroups'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDraftGroupsData())
  }, [])

  return (
    <Container sx={{ height: '100vh', width: '75vw', margin: 'auto' }}>
      <CreateLineup />
    </Container>
  )
}
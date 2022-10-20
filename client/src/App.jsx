import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import DraftGroupSelect from './components/lineup/DraftGroupSelect'
import { fetchDraftGroupsData } from './state/draftGroups'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDraftGroupsData())
  }, [])

  return (
    <DraftGroupSelect />
  )
}
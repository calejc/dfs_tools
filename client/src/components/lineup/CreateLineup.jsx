import React from 'react'
import DraftGroupSelect from './DraftGroupSelect'
import PlayerTable from '../players/PlayerTable'

export default function CreateLineup() {
  return <>
    <DraftGroupSelect />
    <PlayerTable />
  </>
}
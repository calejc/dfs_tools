import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

export default function RemovePlayerButton({ row, removePlayer = () => void (0) }) {

  return <IconButton
    color='error'
    sx={{ padding: '0px!important', fontSize: '6px!important' }}
    onClick={() => removePlayer(row)}
  >
    <CloseIcon />
  </IconButton>
}
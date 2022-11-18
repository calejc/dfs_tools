import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeLineupPlayer } from '../../state/lineup'

export default function RemovePlayerButton({ row }) {
  const dispatch = useDispatch()

  const onClick = (row) => {
    dispatch(removeLineupPlayer(row.value.id))
  }

  return <IconButton
    color='error'
    sx={{ padding: '0px!important', fontSize: '6px!important' }}
    onClick={() => onClick(row)}
  >
    <CloseIcon />
  </IconButton>
}
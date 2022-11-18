import { IconButton } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updatePlayer } from '../../../state/draftGroup'
import { MIN_MAX } from './ExposureInput'

export default function LockButton({ player }) {
  const dispatch = useDispatch()

  const onClick = (player) => {
    const updated = { ...player }
    updated[MIN_MAX.MAX] = 100
    updated[MIN_MAX.MIN] = 100
    dispatch(updatePlayer(updated))
  }

  return <IconButton
    color='success'
    size='small'
    sx={{ padding: '0px!important', fontSize: '6px!important' }}
    onClick={() => onClick(player)}
  >
    <LockIcon fontSize='small' />
  </IconButton>
}
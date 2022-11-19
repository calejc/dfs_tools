import React from 'react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { IconButton } from '@mui/material'
import { useDispatch } from 'react-redux'
import { updatePlayer } from '../../../state/draftGroup'
import { MIN_MAX } from './ExposureInput'

export default function ExcludeButton({ player }) {
  const dispatch = useDispatch()

  const onClick = (player) => {
    const updated = { ...player }
    updated[MIN_MAX.MAX] = 0
    updated[MIN_MAX.MIN] = 0
    dispatch(updatePlayer(updated))
  }

  return <IconButton
    color='error'
    size='small'
    sx={{ padding: '0px!important', fontSize: '6px!important' }}
    onClick={() => onClick(player)}
  >
    <DoNotDisturbAltIcon fontSize='small' />
  </IconButton>

}
import React from 'react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { IconButton } from '@mui/material'

export default function ExcludeButton({ player, excludePlayer = () => void (0) }) {

  return <IconButton
    color='error'
    size='small'
    sx={{ padding: '0px!important', fontSize: '6px!important' }}
    onClick={(e) => excludePlayer(e, player, null, false, true)}
  >
    <DoNotDisturbAltIcon fontSize='small' />
  </IconButton>

}
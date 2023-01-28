import { IconButton } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import React from 'react'

export default function LockButton({ player, lockPlayer = () => void (0) }) {

  return <IconButton
    color='success'
    size='small'
    sx={{ padding: '0px!important', fontSize: '6px!important' }}
    onClick={(e) => lockPlayer(e, player, null, true)}
  >
    <LockIcon fontSize='small' />
  </IconButton>
}
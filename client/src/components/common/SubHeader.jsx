import { Typography } from '@mui/material'
import React from 'react'
import '../../App.css'

export default function SubHeader({ text, size = 'small' }) {
  return <Typography className='tab-card-text' fontSize={size} color='text.secondary'>{text}</Typography>
}
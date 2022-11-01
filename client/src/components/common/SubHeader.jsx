import { Typography } from '@mui/material'
import React from 'react'

export default function SubHeader({ text, size = 'small' }) {
  return <Typography fontSize={size} color='text.secondary'>{text}</Typography>
}
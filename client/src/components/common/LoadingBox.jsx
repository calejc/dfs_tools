import { CircularProgress, Grid } from '@mui/material'
import React from 'react'

export default function LoadingBox({ isLoading }) {
  return (isLoading && (
    <Grid
      width='100%'
      height='50%'
      container
      direction='row'
      justifyContent='center'
      alignItems='center'
    >
      <Grid item xs={12} textAlign='center'>
        <CircularProgress />
      </Grid>
    </Grid>
  ))
}
import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardContent, Grid, Typography } from '@mui/material'

export default function DraftGroupSelect() {
  const draftGroups = useSelector(state => state.draftGroups.draftGroups)

  return (draftGroups.length > 0 && (
    <Grid
      sx={{ mt: '50px' }}
      container
      direction='row'
      justifyContent='flex-start'
      alignItems='center'
    >
      {draftGroups.map((dg) => {
        return <Grid item key={dg.id}>
          <Card>
            <CardContent>
              <Typography variant='h5'>{dg.start}</Typography>
              <Typography color="text.secondary">{dg.games.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      })}
    </Grid>
  )
  )
}
import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import toReadableDate from '../../util/toReadableDate'

export default function DraftGroupSelectOption({ draftGroup, onSelect }) {
  return <>
    <Grid
      item
      key={draftGroup.id}
      sx={{ cursor: 'pointer' }}
      onClick={() => onSelect(draftGroup.id)}
    >
      <Card>
        <CardContent>
          <Typography>{draftGroup.type.toUpperCase()}</Typography>
          <Typography>{toReadableDate(draftGroup.start)}</Typography>
          <Typography color="text.secondary">{draftGroup.games.length}</Typography>
        </CardContent>
      </Card>
    </Grid>
  </>
}
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { selectDraftGroup } from '../../state/draftGroups'
import toReadableDate from '../../util/toReadableDate'
import '../../App.css'
import { setLineupShell } from '../../state/lineup'

export default function DraftGroupSelect() {
  const { draftGroups, selectedDraftGroup } = useSelector(state => state.draftGroups)
  const dispatch = useDispatch()

  const onSelect = (id) => {
    dispatch(selectDraftGroup(id))
    dispatch(setLineupShell(draftGroups.filter(dg => dg.id === id)[0].type))
  }

  const cardClassName = (id) => {
    if (!selectedDraftGroup) {
      return ''
    }

    if (selectedDraftGroup === id) {
      return 'selected'
    } else {
      return 'not-selected'
    }
  }

  return (draftGroups.length > 0 && (
    <Grid
      sx={{ mt: '50px' }}
      container
      direction='row'
      columnSpacing={2}
      justifyContent='flex-start'
      alignItems='center'
    >
      {draftGroups.map((dg) => {
        return <Grid
          item
          key={dg.id}
          sx={{ cursor: 'pointer' }}
          onClick={() => onSelect(dg.id)}
        >
          <Card
            sx={{ border: '1px solid black' }}
            className={cardClassName(dg.id)}
          >
            <CardContent>
              <Typography>{dg.type.toUpperCase()}</Typography>
              <Typography>{toReadableDate(dg.start)}</Typography>
              <Typography color="text.secondary">{dg.games.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      })}
    </Grid>
  ))
}
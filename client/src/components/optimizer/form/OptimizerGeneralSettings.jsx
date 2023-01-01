import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, Slider, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateConstraints } from '../../../state/lineups'

export default function OptimizerGeneralSettings() {
  const constraints = useSelector(state => state.lineups.settings)
  const dispatch = useDispatch()

  const onChange = (e, v) => {
    dispatch(updateConstraints({
      ...constraints,
      [e.target.name]: v ? v : e.target.valueAsNumber
    }))
  }

  const onFlexToggle = (e) => {
    dispatch(updateConstraints({
      ...constraints,
      flex_positions: {
        ...constraints.flex_positions,
        [e.target.name]: e.target.checked
      }
    }))
  }


  return <Grid container>
    <Grid container spacing={2}>
      <Grid item container xs={10} direction="row" alignItems='center' columnSpacing={2}>
        <Grid item>Max unstacked players per team: </Grid>
        <Grid item>
          <TextField
            name='max_per_team'
            value={constraints.max_per_team}
            size="small"
            sx={{ width: "70px!important" }}
            type='number'
            onChange={onChange}
          />
        </Grid>
      </Grid>
      <Grid item container xs={10} direction="row" alignItems='center' columnSpacing={2}>
        <Grid item>Uniques: </Grid>
        <Grid item>
          <TextField
            name='unique'
            value={constraints.unique}
            size="small"
            sx={{ width: "70px!important" }}
            type='number'
            onChange={onChange}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Typography>Number of Lineups: {constraints.count}</Typography>
      </Grid>
      <Grid item>
        <Box sx={{ width: '250px!important' }}>
          <Slider
            name='count'
            size='small'
            max={150}
            min={1}
            track={false}
            value={constraints.count}
            onChange={onChange}
            valueLabelDisplay="auto"
          />
        </Box>
      </Grid>
    </Grid>
    <Grid container>
      <FormControl variant='standard'>
        <FormLabel component='legend'>Flex Positions</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox
              name='RB'
              size='small'
              checked={constraints.flex_positions.RB}
              onChange={onFlexToggle}
            />}
            label="RB"
          />
          <FormControlLabel
            control={<Checkbox
              name='WR'
              size='small'
              checked={constraints.flex_positions.WR}
              onChange={onFlexToggle}
            />}
            label="WR"
          />
          <FormControlLabel
            control={<Checkbox
              name='TE'
              size='small'
              checked={constraints.flex_positions.TE}
              onChange={onFlexToggle}
            />}
            label="TE"
          />
        </FormGroup>
      </FormControl>
    </Grid>
  </Grid>

}
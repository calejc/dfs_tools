import { FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, TextField } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateConstraints } from '../../../state/lineups'

export default function OptimizerStackSettings() {
  const constraints = useSelector(state => state.lineups.settings)
  const dispatch = useDispatch()

  const onChange = (e) => {
    if (e.target.name.startsWith('Opp-')) {
      dispatch(updateConstraints({
        ...constraints,
        stack: {
          ...constraints.stack,
          Opp: {
            ...constraints.stack.Opp,
            [e.target.name.split('-')[1]]: parseInt(e.target.value)
          }
        }
      }))
    } else {
      dispatch(updateConstraints({
        ...constraints,
        stack: {
          ...constraints.stack,
          WithQB: {
            ...constraints.stack.WithQB,
            [e.target.name]: parseInt(e.target.value)
          }
        }
      }))
    }
  }

  return <>
    <Grid container columnSpacing={3} direction='row' sx={{ width: '400px' }}>
      <Grid item xs={5}>
        <FormControl variant='standard'>
          <FormLabel component='legend'>Players With QB</FormLabel>
          <FormGroup>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>RB: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  size='small'
                  name='RB'
                  value={constraints.stack.WithQB.RB}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>WR: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.WithQB.WR}
                  size='small'
                  name='WR'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>TE: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.WithQB.TE}
                  size='small'
                  name='TE'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>RB/WR/TE: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.WithQB.FLEX}
                  size='small'
                  name='FLEX'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>WR/TE: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.WithQB.WRTE}
                  size='small'
                  name='WRTE'
                  onChange={onChange}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <FormControl variant='standard'>
          <FormLabel component='legend'>Bringbacks</FormLabel>
          <FormGroup>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>RB: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.Opp.RB}
                  size='small'
                  name='Opp-RB'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>WR: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.Opp.WR}
                  size='small'
                  name='Opp-WR'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>TE: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.Opp.TE}
                  size='small'
                  name='Opp-TE'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>RB/WR/TE: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.Opp.FLEX}
                  size='small'
                  name='Opp-FLEX'
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={8} alignItems='center'>
                <FormLabel sx={{ textAlign: 'center' }}>WR/TE: </FormLabel>
              </Grid>
              <Grid item xs={4}>
                <Input
                  sx={{ maxWidth: '15px' }}
                  value={constraints.stack.Opp.WRTE}
                  size='small'
                  name='Opp-WRTE'
                  onChange={onChange}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </Grid>
    </Grid>
  </>

}
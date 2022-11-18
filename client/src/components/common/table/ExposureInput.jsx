import { styled, TextField } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updatePlayer } from '../../../state/draftGroup'

export const MIN_MAX = {
  MAX: 'max',
  MIN: 'min'
}

export default function ExposureInput({ minMax, player }) {
  const dispatch = useDispatch()

  const [localValue, setLocalValue] = useState()

  useEffect(() => {
    setLocalValue(player[minMax])
  }, [])

  const update = (e) => {
    setLocalValue(e.target.value)
    const updated = { ...player }
    updated[minMax] = e.target.value
    dispatch(updatePlayer(updated))
  }

  const NumberInputField = styled(TextField)({
    '& .MuiInputBase-input': {
      lineHeight: '1px!important',
      padding: '2px 4px!important',
      maxHeight: '1.35rem',
      maxWidth: '25px',
      fontSize: '0.875rem',
      textAlign: 'right'
    }
  })

  return <NumberInputField
    value={player[minMax]}
    onChange={update}
    inputProps={{
      inputMode: 'numeric',
      pattern: '/^-?\d+(?:\.\d+)?$/g'
    }}
  />
}
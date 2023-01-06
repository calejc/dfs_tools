import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updatePlayer } from '../../../state/draftGroup'
import NumberInputField from './NumberInputField'

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

  return <NumberInputField
    value={player[minMax]}
    onChange={update}
  />
}
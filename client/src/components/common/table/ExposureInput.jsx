import React from 'react'
import { useDispatch } from 'react-redux'
import { updatePlayer } from '../../../state/draftGroup'
import NumberInputField from './NumberInputField'

export default function ExposureInput({ minMax, player }) {
  const dispatch = useDispatch()

  const setExposure = (e) => {
    const updated = { ...player }
    updated[minMax] = e.target.value
    dispatch(updatePlayer(updated))
  }

  return <NumberInputField
    value={player[minMax]}
    onChange={setExposure}
  />
}
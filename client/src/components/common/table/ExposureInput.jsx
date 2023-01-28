import React from 'react'
import NumberInputField from './NumberInputField'

export default function ExposureInput({ minMax, player, setExposure = () => void (0) }) {

  return <NumberInputField
    value={player[minMax]}
    onChange={(e) => setExposure(e, player, minMax)}
  />
}
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function OptimizerStackSettings() {
  const constraints = useSelector(state => state.lineups.settings)
  const dispatch = useDispatch()

  return <></>

}
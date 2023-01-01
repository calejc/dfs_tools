import { Grid, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import OptimizerGeneralSettings from './form/OptimizerGeneralSettings'
import OptimizerStackSettings from './form/OptimizerStackSettings'

export default function OptimizerSettings() {
  const [tab, setTab] = useState(0)

  const tabContent = () => {
    if (tab === 0) {
      return <OptimizerGeneralSettings />
    } else {
      return <OptimizerStackSettings />
    }
  }
  return <Grid container padding='50px' sx={{ heigh: '100vh' }}>
    <Grid item>
      <Tabs
        orientation='vertical'
        value={tab}
        onChange={(e, t) => setTab(t)}
      >
        <Tab label='General' />
        <Tab label='Stack' />
      </Tabs>
    </Grid>
    <Grid item sx={{ padding: '20px 0px 25px 50px' }}>
      {tabContent()}
    </Grid>
  </Grid>
}
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card, CardContent, Tab, Tabs, tabsClasses, Typography } from '@mui/material'
import toReadableDate from '../../util/toReadableDate'
import '../../App.css'
import { setLineupShell } from '../../state/lineup'
import SubHeader from './SubHeader'
import { fetchDraftGroupById } from '../../state/draftGroup'
import useLoading from '../../hooks/useLoading'
import REQUEST_STATUS from '../../state/apiBased/REQUEST_STATUS'
import LoadingBox from './LoadingBox'

export default function DraftGroupSelect() {
  const [selectedDraftGroupId, setSelectedDraftGroupId] = useState()
  const { value: draftGroups, status } = useSelector(state => state.draftGroups)
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)
  const { isLoading, loading, done } = useLoading()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLineupShell(selectedDraftGroup?.type))
  }, [selectedDraftGroup])

  const onSelect = (e, id) => {
    setSelectedDraftGroupId(id)
    dispatch(fetchDraftGroupById(id))
  }

  useEffect(() => {
    if ([REQUEST_STATUS.IN_PROGRESS, REQUEST_STATUS.NOT_STARTED].includes(status)) {
      loading()
    } else {
      done()
    }
  }, [status])

  const cardClassName = (id) => {
    if (!selectedDraftGroupId) {
      return ''
    }

    if (selectedDraftGroupId === id) {
      return ''
    } else {
      return 'not-selected'
    }
  }

  const draftGroupTypeDescriptor = (dg) => {
    return dg.type.toUpperCase()
  }

  const draftGroupSuffixDescriptor = (dg) => {
    return dg.suffix ? dg.suffix : 'Main'
  }

  const draftGroupGamesDescriptor = (dg) => {
    return dg.games > 1 ? `${dg.games} games` : <br />
  }

  return (
    <>
      <LoadingBox isLoading={isLoading} />
      {(!isLoading && draftGroups.length > 0) && (
        <Box
          sx={{ mt: '50px' }}
        >
          <Tabs
            value={selectedDraftGroupId ? selectedDraftGroupId : false}
            onChange={onSelect}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 },
              },
            }}
          >
            {draftGroups.map((dg) => {
              return <Tab
                value={dg.id}
                key={dg.id}
                sx={{ cursor: 'pointer', padding: '4px!important' }}
                label={
                  <Card
                    width='100%'
                    padding='0px'
                    sx={{ border: '1px solid black' }}
                    className={cardClassName(dg.id)}
                  >
                    <CardContent sx={{ padding: '10px!important' }}>
                      <Typography className='tab-card-text'>{toReadableDate(dg.start)}</Typography>
                      <SubHeader text={draftGroupTypeDescriptor(dg)} />
                      <SubHeader text={draftGroupSuffixDescriptor(dg)} />
                      <SubHeader text={draftGroupGamesDescriptor(dg)} />
                    </CardContent>
                  </Card>
                }
              />
            })}
          </Tabs>
        </Box>
      )}
    </>
  )
}
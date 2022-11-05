import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import toReadableDate from '../../util/toReadableDate'
import '../../App.css'
import { setLineupShell } from '../../state/lineup'
import SubHeader from '../common/SubHeader'
import { fetchDraftGroupById } from '../../state/draftGroup'
import useLoading from '../../hooks/useLoading'
import REQUEST_STATUS from '../../state/apiBased/REQUEST_STATUS'
import LoadingBox from '../common/LoadingBox'

export default function DraftGroupSelect() {
  const [selectedDraftGroupId, setSelectedDraftGroupId] = useState()
  const { value: draftGroups, status } = useSelector(state => state.draftGroups)
  const { value: selectedDraftGroup } = useSelector(state => state.draftGroup)
  const { isLoading, loading, done } = useLoading()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLineupShell(selectedDraftGroup?.type))
  }, [selectedDraftGroup])

  const onSelect = (id) => {
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
    return dg.games > 1 ? `${dg.games} games` : <br/>
  }

  return (
    <>
      <LoadingBox isLoading={isLoading} />
      {(!isLoading && draftGroups.length > 0) && (
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
                  <Typography>{toReadableDate(dg.start)}</Typography>
                  <SubHeader text={draftGroupTypeDescriptor(dg)} />
                  <SubHeader text={draftGroupSuffixDescriptor(dg)} />
                  <SubHeader text={draftGroupGamesDescriptor(dg)} />
                </CardContent>
              </Card>
            </Grid>
          })}
        </Grid>
      )}
    </>
  )
}
import React, { useState } from 'react'
import '../../App.css'
import { Box, Card, CardContent, Tab, Tabs, tabsClasses, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { game } from '../../state/draftGroup'
import toReadableTime from '../../util/toReadableTime'
import SubHeader from './SubHeader'

export default function GameSelect() {
  const [selectedGame, setSelectedGame] = useState()
  const { value: { games: selectedDraftGroupGames } } = useSelector(state => state.draftGroup)
  const dispatch = useDispatch()

  const onSelect = (id) => {
    let gameSelection = id
    if (id === selectedGame) {
      gameSelection = undefined
    }
    setSelectedGame(gameSelection)
    dispatch(game(gameSelection))
  }

  const cardClassName = (id) => {
    if (!selectedGame) {
      return ''
    }

    if (selectedGame === id) {
      return ''
    } else {
      return 'not-selected'
    }
  }

  return <>
    <Box>
      <Tabs
        value={selectedGame ? selectedGame : false}
        variant='scrollable'
        scrollButtons='auto'
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {selectedDraftGroupGames?.map(g => {
          return <Tab
            onClick={() => onSelect(g.id)}
            value={g.id}
            key={g.id}
            sx={{ cursor: 'pointer', padding: '4px!important' }}
            label={
              <Card
                width='100%'
                padding='0px'
                sx={{ border: '1px solid black' }}
                className={cardClassName(g.id)}
              >
                <CardContent sx={{ padding: '10px!important' }}>
                  <Typography className='tab-card-text'>{`${g.away_team.dk_abbr} @ ${g.home_team.dk_abbr}`}</Typography>
                  <SubHeader text={toReadableTime(g.start)} />
                </CardContent>
              </Card>
            }
          />
        })}
      </Tabs>
    </Box>
  </>
}
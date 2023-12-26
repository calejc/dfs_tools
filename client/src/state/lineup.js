import createInitialState from "./apiBased/createInitialState"
import { createSlice } from "@reduxjs/toolkit"

export const POSITIONS = {
  511: {
    label: 'CPT',
    rosterSlotId: 511,
    draftGroupType: 'showdown',
    slots: 1,
    order: 1
  },
  512: {
    label: 'FLEX',
    rosterSlotId: 512,
    draftGroupType: 'showdown',
    slots: 5,
    order: 2
  },
  66: {
    label: 'QB',
    rosterSlotId: 66,
    draftGroupType: 'classic',
    slots: 1,
    order: 1
  },
  67: {
    label: 'RB',
    rosterSlotId: 67,
    draftGroupType: 'classic',
    slots: 2,
    order: 2
  },
  68: {
    label: 'WR',
    rosterSlotId: 68,
    draftGroupType: 'classic',
    slots: 3,
    order: 3
  },
  69: {
    label: 'TE',
    rosterSlotId: 69,
    draftGroupType: 'classic',
    slots: 1,
    order: 4
  },
  70: {
    label: 'FLEX',
    rosterSlotId: 70,
    draftGroupType: 'classic',
    slots: 1,
    order: 5
  },
  71: {
    label: 'DST',
    rosterSlotId: 71,
    draftGroupType: 'classic',
    slots: 1,
    order: 6
  }
}

const generateShell = (type) => {
  const lineup = []
  Object.keys(POSITIONS).forEach(pos => {
    if (POSITIONS[pos].draftGroupType === type) {
      Array(POSITIONS[pos].slots).fill().forEach(() => {
        lineup.push({
          roster_slot_id: pos,
          label: POSITIONS[pos].label,
          value: {}
        })
      })
    }
  })
  return lineup.slice().sort((a, b) => a.order - b.order)
}

export const initialState = {
  ...createInitialState([]),
  useCeilingProjection: true
}

const lineupSlice = createSlice({
  name: 'lineup',
  initialState,
  reducers: {
    setUseCeilingProjection(state, action) {
      state.useCeilingProjection = action.payload
    },
    setShell(state, action) {
      state.value = generateShell(action.payload)
    },
    setPlayer(state, action) {
      const player = action.payload
      const positionSpecificSlots = state.value.filter(x => {
        return (parseInt(x.roster_slot_id) === parseInt(player.roster_slot_id) ||
          (parseInt(x.roster_slot_id) == 70 && player.flex_id)) &&
          Object.keys(x.value).length === 0
      })
      if (positionSpecificSlots.length > 0) {
        positionSpecificSlots[0].value = player
      }
    },
    removePlayer(state, action) {
      console.log('action payload: ', action.payload)
      // console.log('state value: ', JSON.stringify(state.value))
      state.value.filter(x => {
        return (parseInt(x.value?.id) === parseInt(action.payload))
      })[0].value = {}
    }
  },
  extraReducers: {}
})

export const setUseCeilingProjection = (useCeiling) => lineupSlice.actions.setUseCeilingProjection(useCeiling)
export const setLineupShell = (draftGroupType) => lineupSlice.actions.setShell(draftGroupType)
export const setLineupPlayer = (player) => lineupSlice.actions.setPlayer(player)
export const removeLineupPlayer = (playerId) => lineupSlice.actions.removePlayer(playerId)

export const lineupReducer = lineupSlice.reducer
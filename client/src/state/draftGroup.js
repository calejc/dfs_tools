import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import getDraftGroupById from "../api/getDraftGroupById"
import { SORT_DIR } from "../shared/CONSTANTS"
import createDefaultReducersForAsyncThunk from "./apiBased/createDefaultReducersForAsyncThunk"
import createInitialState from "./apiBased/createInitialState"
import REQUEST_STATUS from "./apiBased/REQUEST_STATUS"

export const PARAMETERS = {
  Query: {
    name: 'query',
    default: '',
  },
  Position: {
    name: 'position',
    default: 0,
  },
  SortBy: {
    name: 'sortBy',
    default: 'salary',
  },
  SortDir: {
    name: 'sortDir',
    default: SORT_DIR.DESCENDING,
  },
  Page: {
    name: 'page',
    default: 0,
  },
  PerPage: {
    name: 'perPage',
    default: 20,
  },
  ShowAll: {
    name: 'showAll',
    default: false,
  },
  Game: {
    name: 'game',
    default: null
  }
}

const initialParameters = () => {
  let params = {}
  Object.keys(PARAMETERS).forEach(p => {
    Object.assign(params, { [PARAMETERS[p].name]: PARAMETERS[p].default })
  })
  return params
}

export const initialState = {
  ...createInitialState({}),
  filtered: [],
  paginated: [],
  parameters: initialParameters()
}

export const fetchDraftGroupById = createAsyncThunk(
  'fetchDraftGroupById',
  async (dgid) => await getDraftGroupById(dgid)
)

const sorted = (filteredData, sortBy, isDesc) => {
  return filteredData?.slice().sort((a, b) => {
    return isDesc ?
      b[sortBy] - a[sortBy] :
      a[sortBy] - b[sortBy]
  })
}

const gameSelectionIncludesPlayer = (player, gameId) => {
  return gameId ? player.game_id == gameId : true
}

const playerForFilter = (player, currentFilter) => {
  if (parseInt(currentFilter) === 0) {
    return true
  }

  if (parseInt(currentFilter) === 70) {
    return player.flex_id
  }

  return parseInt(currentFilter) === parseInt(player.roster_slot_id)
}

const hasProjection = (p, params) => {
  return params.showAll ? true : [p.base, p.ceiling, p.ownership].some(projectedValue => projectedValue !== null && parseInt(projectedValue) !== 0)
}


const rowsForCurrPage = (data, page, perPage) => {
  return data?.slice(
    page * perPage,
    page * perPage + perPage
  )
}

const filtered = (allPlayers, params, playersInLineup) => {
  const filteredPlayers = allPlayers?.filter(p => {
    return gameSelectionIncludesPlayer(p, params.game) &&
      playerForFilter(p, params.position) &&
      p.player.toUpperCase().includes(params.query) &&
      hasProjection(p, params) &&
      !playersInLineup.map(x => x.value)?.includes({ ...p })
  })

  return sorted(filteredPlayers, params.sortBy, params.sortDir === SORT_DIR.DESCENDING)
}

const draftGroupSlice = createSlice({
  name: 'draftGroup',
  initialState,
  reducers: {
    query(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.Position.name]: [PARAMETERS.Position.default],
        [PARAMETERS.Query.name]: action.payload.toUpperCase()
      }
    },
    filterPositions(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.Position.name]: action.payload
      }
    },
    sort(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.SortBy.name]: action.payload.sortBy,
        [PARAMETERS.SortDir.name]: action.payload.sortDir
      }
    },
    page(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.Page.name]: action.payload
      }
    },
    perPage(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.PerPage.name]: action.payload,
        [PARAMETERS.Page.name]: [PARAMETERS.Page.default]
      }
    },
    showAll(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.ShowAll.name]: action.payload,
      }
    },
    game(state, action) {
      state.parameters = {
        ...state.parameters,
        [PARAMETERS.Game.name]: action.payload
      }
    },
    reset(state) {
      state.parameters = initialParameters()
    },
    setFiltered(state, action) {
      const filteredAndSorted = filtered(state.value.players?.slice(), state.parameters, action.payload)
      state.filtered = filteredAndSorted
      state.paginated = rowsForCurrPage(filteredAndSorted, state.parameters.page, state.parameters.perPage)
    },
    updatePlayer(state, action) {
      const players = state.value.players?.slice()
      const existing = players.filter(p => p.id === action.payload.id)[0]
      players[players.indexOf(existing)] = action.payload
      state.value.players = players
    },
    clearDraftGroup(state) {
      state.value = {}
      state.filtered = []
      state.paginated = []
      state.status = REQUEST_STATUS.NOT_STARTED
    }
  },
  extraReducers: createDefaultReducersForAsyncThunk(fetchDraftGroupById)
})

export const query = (query) => draftGroupSlice.actions.query(query)
export const filter = (filter) => draftGroupSlice.actions.filterPositions(filter)
export const sort = (sortBy, sortDir) => draftGroupSlice.actions.sort({ sortBy, sortDir })
export const page = (pageNumber) => draftGroupSlice.actions.page(pageNumber)
export const perPage = (perPage) => draftGroupSlice.actions.perPage(perPage)
export const showAll = (showAll) => draftGroupSlice.actions.showAll(showAll)
export const game = (gameId) => draftGroupSlice.actions.game(gameId)
export const reset = () => draftGroupSlice.actions.reset()
export const setFiltered = (currLineup) => draftGroupSlice.actions.setFiltered(currLineup)
export const updatePlayer = (player) => draftGroupSlice.actions.updatePlayer(player)
export const clearDraftGroup = () => draftGroupSlice.actions.clearDraftGroup()
export const draftGroupReducer = draftGroupSlice.reducer
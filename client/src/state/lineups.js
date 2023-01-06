import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import postOptimize from "../api/postOptimize"
import createDefaultReducersForAsyncThunk from "./apiBased/createDefaultReducersForAsyncThunk"
import createInitialState from "./apiBased/createInitialState"

export const DEFAULT_STACK_OPTIONS = {
  WithQB: {
    RB: 0,
    WR: 0,
    TE: 0,
    FLEX: 0,
    WRTE: 0
  },
  Opp: {
    RB: 0,
    WR: 0,
    TE: 0,
    FLEX: 0,
    WRTE: 0
  }
}

export const DEFAULT_FLEX_POSITIONS = {
  RB: true,
  WR: true,
  TE: true
}

export const OPTIMIZER_CONSTRAINTS = {
  TotalLineups: {
    name: 'count',
    default: 150
  },
  Unique: {
    name: 'unique',
    default: 2
  },
  MaxPerTeam: {
    name: 'max_per_team',
    default: 4
  },
  FlexPositions: {
    name: 'flex_positions',
    default: DEFAULT_FLEX_POSITIONS
  },
  Stack: {
    name: 'stack',
    default: DEFAULT_STACK_OPTIONS
  }
}

const initialConstraints = () => {
  let params = {}
  Object.keys(OPTIMIZER_CONSTRAINTS).forEach(p => {
    Object.assign(params, { [OPTIMIZER_CONSTRAINTS[p].name]: OPTIMIZER_CONSTRAINTS[p].default })
  })
  return params
}

export const initialState = {
  ...createInitialState([]),
  settings: initialConstraints()
}

export const optimizeLineups = createAsyncThunk(
  'fetchOptimizedLineups',
  async (_, { getState }) => await postOptimize(
    getState().draftGroup.value.id,
    {
      ...getState().lineups.settings,
      useCeiling: getState().draftGroup.parameters.useCeiling,
      players: getState().draftGroup.value.players
    }
  )
)

const lineupsSlice = createSlice({
  name: 'lineups',
  initialState,
  reducers: {
    updateConstraints(state, action) {
      state.settings = action.payload
    }
  },
  extraReducers: createDefaultReducersForAsyncThunk(optimizeLineups)
})

export const updateConstraints = (constraints) => lineupsSlice.actions.updateConstraints(constraints)
export const lineupsReducer = lineupsSlice.reducer
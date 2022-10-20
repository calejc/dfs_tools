import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import getSlates from "../api/getDraftGroups"
import { asyncPendingReducer, asyncRejectedReducer } from "./apiBased/createDefaultReducersForAsyncThunk"
import REQUEST_STATUS from "./apiBased/REQUEST_STATUS"

export const initialState = {
  draftGroups: [],
  selectedDraftGroup: null,
  error: null,
  status: REQUEST_STATUS.NOT_STARTED
}

export const fetchDraftGroupsData = createAsyncThunk(
  'fetchDraftGroupsData',
  async () => await getSlates()
)

const extraReducers = {
  [fetchDraftGroupsData.pending]: (state) => {
    asyncPendingReducer(state)
  },
  [fetchDraftGroupsData.fulfilled]: (state, action) => {
    state.status = REQUEST_STATUS.SUCCEEDED
    state.draftGroups = action.payload
    state.selectDraftGroup = {}
  },
  [fetchDraftGroupsData.rejected]: (state, action) => {
    asyncRejectedReducer(state, action)
  }
}

const draftGroupsSlice = createSlice({
  name: 'draftGroups',
  initialState,
  reducers: {
    selectDraftGroup(state, action) {
      state.selectedDraftGroup = action.payload
    }
  },
  extraReducers: extraReducers
})

export const selectDraftGroup = (draftGroupId) => draftGroupsSlice.actions.selectDraftGroup(draftGroupId)
export const draftGroupsReducer = draftGroupsSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import getDraftGroupById from "../api/getDraftGroupById"
import createDefaultReducersForAsyncThunk from "./apiBased/createDefaultReducersForAsyncThunk"
import createInitialState from "./apiBased/createInitialState"

export const initialState = createInitialState({})

export const fetchDraftGroupById = createAsyncThunk(
  'fetchDraftGroupById',
  async (dgid) => await getDraftGroupById(dgid)
)

const draftGroupSlice = createSlice({
  name: 'draftGroup',
  initialState,
  reducers: {},
  extraReducers: createDefaultReducersForAsyncThunk(fetchDraftGroupById)
})

export const draftGroupReducer = draftGroupSlice.reducer
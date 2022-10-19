import getSlates from "../api/getDraftGroups"
import createDefaultReducersForAsyncThunk from "./apiBased/createDefaultReducersForAsyncThunk"
import createInitialState from "./apiBased/createInitialState"

export const initialState = createInitialState([])

export const fetchDraftGroupsData = createAsyncThunk(
  'fetchDraftGroupsData',
  async () => await getSlates()
)

const draftGroupsSlice = createSlice({
  name: 'draftGroups',
  initialState,
  reducers: {},
  extraReducers: createDefaultReducersForAsyncThunk(fetchDraftGroupsData)
})

export const draftGroupsReducer = draftGroupsSlice.reducer
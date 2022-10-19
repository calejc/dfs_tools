import REQUEST_STATUS from "./REQUEST_STATUS"

export const asyncPendingReducer = (state) => {
  state.status = REQUEST_STATUS.IN_PROGRESS
}

export const asyncFulfilledReducer = (state, action) => {
  state.status = REQUEST_STATUS.SUCCEEDED
  state.value = action.payload
}

export const asyncRejectedReducer = (state, action) => {
  state.status = REQUEST_STATUS.FAILED
  state.error = action.error.message
}

const createDefaultReducersForAsyncThunk = (asyncThunk) => ({
  [asyncThunk.pending]: asyncPendingReducer,
  [asyncThunk.fulfilled]: asyncFulfilledReducer,
  [asyncThunk.rejected]: asyncRejectedReducer
})

export default createDefaultReducersForAsyncThunk
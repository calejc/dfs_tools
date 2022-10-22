import { configureStore } from '@reduxjs/toolkit'
import { draftGroupsReducer } from './draftGroups'
import { lineupReducer } from './lineup'

export const reducer = {
  draftGroups: draftGroupsReducer,
  lineup: lineupReducer
}

export default configureStore({ reducer })
import { configureStore } from '@reduxjs/toolkit'
import { draftGroupReducer } from './draftGroup'
import { draftGroupsReducer } from './draftGroups'
import { lineupReducer } from './lineup'

export const reducer = {
  draftGroups: draftGroupsReducer,
  lineup: lineupReducer,
  draftGroup: draftGroupReducer
}

export default configureStore({ reducer })
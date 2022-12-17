import { configureStore } from '@reduxjs/toolkit'
import { draftGroupReducer } from './draftGroup'
import { draftGroupsReducer } from './draftGroups'
import { lineupReducer } from './lineup'
import { lineupsReducer } from './lineups'

export const reducer = {
  draftGroups: draftGroupsReducer,
  draftGroup: draftGroupReducer,
  lineups: lineupsReducer,
  lineup: lineupReducer
}

export default configureStore({ reducer })
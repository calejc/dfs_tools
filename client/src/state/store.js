import { configureStore } from '@reduxjs/toolkit'
import { draftGroupReducer } from './draftGroup'
import { draftGroupsReducer } from './draftGroups'
import { lineupReducer } from './lineup'
import { lineupsReducer } from './lineups'

export const reducer = {
  draftGroups: draftGroupsReducer,
  lineup: lineupReducer,
  draftGroup: draftGroupReducer,
  lineups: lineupsReducer
}

export default configureStore({ reducer })
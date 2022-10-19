import { configureStore } from '@reduxjs/toolkit'
import { draftGroupsReducer } from './draftGroups'

export const reducer = {
  draftGroups: draftGroupsReducer
}

export default configureStore({ reducer })
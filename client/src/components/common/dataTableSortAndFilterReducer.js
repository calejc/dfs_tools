export const SORT_DIR = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
}

export const ACTIONS = {
  FILTER: "FILTER",
  SORT: "SORT",
  PAGE: "PAGE",
  PER_PAGE: "PER_PAGE",
  RESET: "RESET"
}

export function DEFAULT_SORTING_AND_FILTERING_STATE(defaultSortBy) {
  return {
    filter: 0,
    sortBy: defaultSortBy,
    sortDir: SORT_DIR.DESCENDING,
    page: 0,
    perPage: 15
  }
}

export const dataTableSortAndFilterReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FILTER:
      return {
        ...state,
        filter: action.payload
      }
    case ACTIONS.SORT:
      return {
        ...state,
        sortBy: action.payload.by,
        sortDir: action.payload.sortDir
      }
    case ACTIONS.PAGE:
      return {
        ...state,
        page: action.payload
      }
    case ACTIONS.PER_PAGE:
      return {
        ...state,
        perPage: action.payload,
        page: DEFAULT_SORTING_AND_FILTERING_STATE(action.payload.defaultSortBy).page
      }
    case ACTIONS.RESET:
      return DEFAULT_SORTING_AND_FILTERING_STATE(action.payload)
    default:
      return state
  }
}
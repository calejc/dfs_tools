export const SORT_DIR = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
}

export const ACTIONS = {
  QUERY: "QUERY",
  FILTER: "FILTER",
  SORT: "SORT",
  PAGE: "PAGE",
  PER_PAGE: "PER_PAGE",
  RESET: "RESET"
}

const DEFAULT_PAGE = 0
const DEFAULT_PER_PAGE = 20
const DEFAULT_QUERY = ''

export function DEFAULT_SORTING_AND_FILTERING_STATE(defaultSortBy) {
  return {
    query: DEFAULT_QUERY,
    filter: 0,
    sortBy: defaultSortBy,
    sortDir: SORT_DIR.DESCENDING,
    page: DEFAULT_PAGE,
    perPage: DEFAULT_PER_PAGE
  }
}

export const dataTableSortAndFilterReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.QUERY:
      return {
        ...state,
        query: action.payload.toUpperCase()
      }
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
        perPage: action.payload.perPage,
        page: DEFAULT_PAGE
      }
    case ACTIONS.RESET:
      return DEFAULT_SORTING_AND_FILTERING_STATE(action.payload)
    default:
      return state
  }
}
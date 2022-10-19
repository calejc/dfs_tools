import REQUEST_STATUS from "./REQUEST_STATUS"

const createInitialState = (defaultValue = null) => ({
  value: defaultValue,
  error: null,
  status: REQUEST_STATUS.NOT_STARTED
})

export default createInitialState
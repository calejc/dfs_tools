import axios from "./config/axios"

export default async function postOptimize(draftGroupId, data) {
  const response = await axios.post(`/optimize?draftGroup=${draftGroupId}`, { data })
  return response.data
}
import axios from "./config/axios"

export default async function postOptimize(data) {
  const response = await axios.post(`/optimize`, { data: data })
  return response.data
}
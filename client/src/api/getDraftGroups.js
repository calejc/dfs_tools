import axios from './config/axios'

export default async function getDraftGroups() {
  const response = await axios.get('/upcoming-draft-groups')
  return response.data
}
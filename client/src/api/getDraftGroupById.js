import axios from './config/axios'

export default async function getDraftGroupById(dgid) {
  const resp = await axios.get(`/draft-group/${dgid}`)
  return resp.data
}
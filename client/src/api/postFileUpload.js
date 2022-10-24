import axios from './config/axios'

export default async function postFileUpload(file, source, draftGroup) {
  const response = await axios.post(`/upload?source=${source}&draftGroup=${draftGroup}`, { file: file }, { headers: { 'Content-Type': 'multipart/form-data' } })
  return response.data
}
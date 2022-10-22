import axios from './config/axios'

export default async function postFileUpload(file) {
  const response = await axios.post('/upload', { file: file }, { headers: { 'Content-Type': 'multipart/form-data' } })
  return response.data
}
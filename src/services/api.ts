import axios from 'axios'

const BASE_URL = 'https://uspolis.com.br/api/mobile/'

const api = axios.create({
  baseURL: BASE_URL,
})

export default api

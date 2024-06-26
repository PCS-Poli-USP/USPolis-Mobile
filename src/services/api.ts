import axios from 'axios'

const BASE_URL = 'http://10.0.2.2:80/' //'http://localhost:80/' // 'https://uspolis.com.br/api/mobile/'

const api = axios.create({
  baseURL: BASE_URL,
})

export default api

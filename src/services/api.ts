import axios from 'axios'

//const BASE_URL = 'http://10.0.2.2:8000/mobile' // 'https://uspolis.com.br/api/mobile/'
const BASE_URL = 'http://localhost:8000/mobile' // for iOS dev
//const BASE_URL = 'https://uspolis.com.br/api/mobile/'

const api = axios.create({
  baseURL: BASE_URL,
})

export default api

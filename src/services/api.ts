import axios from "axios";

const BASE_URL = "https://uspolis.com.br/mobile-api/"

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
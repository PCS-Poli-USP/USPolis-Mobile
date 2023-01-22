import axios from "axios";

const BASE_URL = "http://localhost:3333"

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
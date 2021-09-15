import axios from "axios"
import {getToken} from "./auth"

const api = axios.create({
  baseURL: "http://174.200.200.41:8080"
});

api.interceptors.request.use(async config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
import axios from "axios";

let backendApiUrl : string  = String(import.meta.env.VITE_BACKEND_URL);

const api = axios.create({
  baseURL: backendApiUrl,
});

api.interceptors.request.use(async config => {
  const token = localStorage.getItem("@MyEpicTrip:token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;

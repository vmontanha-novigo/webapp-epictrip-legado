import axios from "axios";

let backendApiUrl : string  = String("http://18.208.212.30:8082");

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

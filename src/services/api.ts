import axios from "axios";

let backendApiUrl : string  = String("https://api.tropicaltecnologia.com.br:8082");

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

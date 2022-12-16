import axios from "axios";

let userApiUrl = "https://a3gls8uqy3.execute-api.us-east-1.amazonaws.com/Dev";
let backendApiUrl = "https://07o5cpgwx2.execute-api.us-east-1.amazonaws.com/Dev";

let localEnv = window.location.href.startsWith("http://localhost:3000");
localEnv = false;

if (localEnv) {
  const mockApi = "http://localhost:3001";
  userApiUrl = mockApi;
  backendApiUrl = mockApi;
}

export const userApi = axios.create({
  baseURL: userApiUrl,
});

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

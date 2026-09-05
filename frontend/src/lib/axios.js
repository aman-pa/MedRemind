import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL;
const isValidUrl = rawApiUrl && rawApiUrl.startsWith("http");

const api = axios.create({
  baseURL: isValidUrl ? rawApiUrl : "https://medremind-iaeu.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
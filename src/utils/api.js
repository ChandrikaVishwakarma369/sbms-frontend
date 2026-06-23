import axios from "axios";

const API = axios.create({
  baseURL: "https://sbms-backend.onrender.com/api",
  withCredentials: true,
});

// 🔥 TOKEN AUTOMATICALLY ADD HOGA HAR REQUEST ME
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // apna backend URL
  withCredentials: true, // ✅ cookies send karega
});

export default API;
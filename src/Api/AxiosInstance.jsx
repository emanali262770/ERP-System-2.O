import axios from "axios";

const api = axios.create({
  baseURL: "https://erp-system-backend-2-0.onrender.com/api", // your backend base URL
  withCredentials: true,
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://expensehive.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
});


export default api;

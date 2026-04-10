import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3005",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      err.message = "Network error — please check your connection";
    }
    return Promise.reject(err);
  },
);

export default api;

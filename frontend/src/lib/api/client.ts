import axios from "axios";
import { getAccessToken, clearAuth } from "../auth/token";
import { envConfig } from "@/config/env.config";

const api = axios.create({
  baseURL: envConfig.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized and not in login/register pages
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (!path.includes("/login") && !path.includes("/register")) {
          clearAuth();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
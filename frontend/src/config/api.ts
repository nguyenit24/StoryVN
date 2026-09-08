import axios from "axios";
import { getAccessToken, clearAuth } from "@/common/utils/token";
import { envConfig } from "./env.config";

export const API_URL =
  envConfig.apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Request Interceptor: Tự động gắn token vào header & xử lý FormData
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Nếu upload file (FormData), xóa triệt để Content-Type bằng AxiosHeaders.delete để browser tự gán boundary
    if (config.data instanceof FormData && config.headers) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
        config.headers.delete("content-type");
      } else {
        delete (config.headers as Record<string, unknown>)["Content-Type"];
        delete (config.headers as Record<string, unknown>)["content-type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi 401 tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
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

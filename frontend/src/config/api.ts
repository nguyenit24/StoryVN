import axios, { AxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth,
} from "@/common/utils/token";
import { envConfig } from "./env.config";

export const API_URL =
  envConfig.apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// ─── Silent Refresh State ────────────────────────────────────────────────────
// Đảm bảo chỉ có 1 lần gọi /auth/refresh tại một thời điểm.
// Các request 401 khác sẽ chờ vào queue cho đến khi refresh xong.

let isRefreshing = false;
type QueueItem = { resolve: (token: string) => void; reject: (err: unknown) => void };
let pendingQueue: QueueItem[] = [];

/** Giải phóng queue sau khi refresh thành công */
const resolveQueue = (newToken: string) => {
  pendingQueue.forEach(({ resolve }) => resolve(newToken));
  pendingQueue = [];
};

/** Reject toàn bộ queue khi refresh thất bại */
const rejectQueue = (err: unknown) => {
  pendingQueue.forEach(({ reject }) => reject(err));
  pendingQueue = [];
};

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Tự động gắn token vào header & xử lý FormData
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

// ─── Response Interceptor ────────────────────────────────────────────────────
// Khi nhận 401:
//   1. Thử gọi POST /auth/refresh bằng refreshToken hiện tại
//   2. Nếu thành công → lưu token mới + retry request gốc
//   3. Nếu refresh cũng fail → clearAuth() và reject
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Chỉ xử lý 401 và tránh vòng lặp vô tận (request refresh chính nó cũng 401)
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Lấy refreshToken; nếu không có thì clearAuth ngay
    const refreshToken = typeof window !== "undefined" ? getRefreshToken() : null;
    if (!refreshToken) {
      _handleAuthFailure();
      return Promise.reject(error);
    }

    // Nếu đang có refresh request khác chạy → xếp hàng chờ
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
        }
        originalRequest._retry = true;
        return api(originalRequest);
      });
    }

    // Bắt đầu quá trình refresh
    isRefreshing = true;
    originalRequest._retry = true;

    try {
      // Dùng axios thuần (không dùng instance `api`) để tránh interceptor lặp lại
      const res = await axios.post(
        `${API_URL}/auth/refresh`,
        { refreshToken },
        { timeout: 10000 }
      );

      const newAccessToken: string =
        res.data?.data?.accessToken || res.data?.accessToken;
      const newRefreshToken: string =
        res.data?.data?.refreshToken || res.data?.refreshToken;

      if (!newAccessToken) {
        throw new Error("Không nhận được access token mới từ server");
      }

      // Lưu token mới vào localStorage
      setTokens(newAccessToken, newRefreshToken || undefined);

      // Cập nhật Authorization header mặc định cho các request sau
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      // Giải phóng toàn bộ request đang chờ
      resolveQueue(newAccessToken);

      // Retry request gốc với token mới
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh thất bại → đăng xuất
      rejectQueue(refreshError);
      _handleAuthFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/** Xóa auth data và chuyển về trang login (chỉ khi không ở trang auth) */
function _handleAuthFailure() {
  if (typeof window === "undefined") return;
  clearAuth();
  delete api.defaults.headers.common["Authorization"];
  const path = window.location.pathname;
  const isAuthPage =
    path.includes("/dang-nhap") ||
    path.includes("/dang-ky") ||
    path.includes("/login") ||
    path.includes("/register");
  if (!isAuthPage) {
    window.location.href = "/dang-nhap";
  }
}

export default api;

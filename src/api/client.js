import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = "เกิดข้อผิดพลาด กรุณาลองใหม่") {
  const apiError = error?.response?.data?.error;
  if (apiError?.details?.length) {
    return apiError.details.map((d) => `${d.field}: ${d.message}`).join(", ");
  }
  if (apiError?.message) return apiError.message;
  if (error?.response) return fallback;
  if (error?.request) return "เชื่อมต่อ server ไม่ได้ กรุณาลองใหม่";
  return error?.message ?? fallback;
}

import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { notifications } from "@mantine/notifications";
import router from "../routes/router";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const isPublicRequest = (url?: string) =>
  url?.endsWith("/auth/login") ||
  url?.endsWith("/auth/register") ||
  url?.endsWith("/auth/forgot-password") ||
  url?.endsWith("/auth/reset-password");

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token && !isPublicRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasToken = Boolean(useAuthStore.getState().token);
    const isPublic = isPublicRequest(error.config?.url);

    if (error.response?.status === 401 && hasToken && !isPublic) {
      useAuthStore.getState().logout();

      notifications.show({
        title: "Sesiune expirată",
        message:
          "Din motive de securitate, te rugăm să te autentifici din nou.",
        color: "red",
      });

      router.navigate("/login");
    }
    return Promise.reject(error);
  },
);

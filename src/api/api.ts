import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { notifications } from "@mantine/notifications";
import router from "../routes/router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL nu este setat. Adaugă-l în fișierul .env.",
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const isPublicRequest = (url?: string) => {
  const path = url?.split("?")[0];
  return path ? PUBLIC_PATHS.some((p) => path.endsWith(p)) : false;
};

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

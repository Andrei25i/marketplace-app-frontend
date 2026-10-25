import axios, { type AxiosError, type AxiosResponse } from "axios";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshSession } from "./session";
import type { User } from "@/types/auth.type";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

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
  withCredentials: true,
  timeout: 60000,
});

const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/logout",
];

const pathOf = (url?: string) => url?.split("?")[0] ?? "";

const shouldSkipRefresh = (url?: string) =>
  NO_REFRESH_PATHS.some((p) => pathOf(url).endsWith(p));

const carriesFreshUser = (response: AxiosResponse) => {
  const path = pathOf(response.config.url);
  const method = response.config.method?.toLowerCase();
  return (
    path.endsWith("/user/me") || (method === "put" && path.endsWith("/user"))
  );
};

let resyncTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleUserResync = () => {
  if (resyncTimer) return;

  resyncTimer = setTimeout(async () => {
    try {
      const { data } = await api.get<User>("/user/me");
      useAuthStore.getState().setUpdatedUser(data);
    } catch {
      // Ignore: next request will try resync
    } finally {
      resyncTimer = null;
    }
  }, 300);
};

const checkUserVersion = (response: AxiosResponse) => {
  const header = response.headers["x-user-version"];
  const { user } = useAuthStore.getState();
  if (!header || !user || carriesFreshUser(response)) return;

  if (Number(header) !== Date.parse(user.updated_at)) {
    scheduleUserResync();
  }
};

const notifySessionExpired = () =>
  notifications.show({
    id: "session-expired",
    title: "Sesiune expirată",
    message: "Din motive de securitate, te rugăm să te autentifici din nou.",
    color: "red",
  });

const notifyServerUnavailable = () =>
  notifications.show({
    id: "server-unavailable",
    title: "Serverul pornește",
    message:
      "Serverul se trezește din repaus. Încearcă din nou în câteva secunde.",
    color: "yellow",
  });

api.interceptors.response.use(
  (response) => {
    checkUserVersion(response);
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      shouldSkipRefresh(original.url)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;
    const result = await refreshSession();

    if (result.status === "ok") {
      useAuthStore.setState({ user: result.user, isAuthenticated: true });
      return api(original);
    }

    if (result.status === "unauthenticated") {
      const wasLoggedIn = useAuthStore.getState().user !== null;
      useAuthStore.getState().logout();
      if (wasLoggedIn) notifySessionExpired();
    } else {
      notifyServerUnavailable();
    }

    return Promise.reject(error);
  },
);

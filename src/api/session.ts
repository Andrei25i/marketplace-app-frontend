import axios from "axios";
import type { User } from "@/types/auth.type";

export type RefreshResult =
  | { status: "ok"; user: User }
  | { status: "unauthenticated" }
  | { status: "unavailable" };

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 60_000,
});

const MAX_ATTEMPTS = 3;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const doRefresh = async (): Promise<RefreshResult> => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { data } = await refreshClient.post<{ user: User }>(
        "/auth/refresh",
      );
      return { status: "ok", user: data.user };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return { status: "unauthenticated" };
      }
      if (attempt < MAX_ATTEMPTS) await wait(attempt * 2000);
    }
  }
  return { status: "unavailable" };
};

let inFlight: Promise<RefreshResult> | null = null;

export const refreshSession = (): Promise<RefreshResult> => {
  if (!inFlight) {
    inFlight = doRefresh().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
};

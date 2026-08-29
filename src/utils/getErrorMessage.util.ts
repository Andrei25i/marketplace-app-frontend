import { isAxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "A apărut o eroare. Încearcă din nou.",
): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    return data?.error || data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

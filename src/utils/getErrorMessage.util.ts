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

export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!isAxiosError(error)) return {};

  const fields: unknown = error.response?.data?.fields;
  if (!fields || typeof fields !== "object") return {};

  const result: Record<string, string> = {};
  for (const [key, message] of Object.entries(fields)) {
    const field = key.split(".")[0];
    if (field && typeof message === "string" && !(field in result)) {
      result[field] = message;
    }
  }
  return result;
};

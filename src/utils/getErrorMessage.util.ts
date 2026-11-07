import { isAxiosError } from "axios";

const SERVER_UNREACHABLE =
  "Nu ne-am putut conecta la server. Verifică conexiunea și încearcă din nou.";
const GATEWAY_STATUSES = [502, 503, 504];

export const getErrorMessage = (
  error: unknown,
  fallback = "A apărut o eroare. Încearcă din nou.",
): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    const message: unknown =
      data && typeof data === "object" ? data.error || data.message : undefined;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (!error.response || GATEWAY_STATUSES.includes(error.response.status)) {
      return SERVER_UNREACHABLE;
    }

    return fallback;
  }

  if (error instanceof Error && error.message) {
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

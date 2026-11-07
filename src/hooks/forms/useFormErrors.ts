import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage, getFieldErrors } from "@/utils/getErrorMessage.util";

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const ERROR_SELECTOR = '[aria-invalid="true"], [data-form-error]';

export const useFormErrors = <K extends string>(fields: readonly K[]) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<K>>({});
  const [generalError, setGeneralError] = useState("");
  const [scrollRequest, setScrollRequest] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (scrollRequest === 0) return;

    formRef.current
      ?.querySelector<HTMLElement>(ERROR_SELECTOR)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [scrollRequest]);

  const resetErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError("");
  }, []);

  const clearFieldError = useCallback((field: K) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const showFieldErrors = useCallback((errors: FieldErrors<K>) => {
    setFieldErrors(errors);
    setGeneralError("");
    setScrollRequest((n) => n + 1);
  }, []);

  const showGeneralError = useCallback((message: string) => {
    setFieldErrors({});
    setGeneralError(message);
    setScrollRequest((n) => n + 1);
  }, []);

  const handleRequestError = useCallback(
    (err: unknown, fallback: string) => {
      const serverErrors = getFieldErrors(err);
      const errors: FieldErrors<K> = {};

      for (const field of fields) {
        const message = serverErrors[field];
        if (message) errors[field] = message;
      }

      if (Object.keys(errors).length > 0) {
        showFieldErrors(errors);
      } else {
        showGeneralError(getErrorMessage(err, fallback));
      }
    },
    [fields, showFieldErrors, showGeneralError],
  );

  const bindField =
    <T>(setter: (value: T) => void, field: K) =>
    (value: T) => {
      setter(value);
      clearFieldError(field);
    };

  return {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    clearFieldError,
    showFieldErrors,
    showGeneralError,
    handleRequestError,
    bindField,
  };
};

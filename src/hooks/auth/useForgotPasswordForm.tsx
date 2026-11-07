import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";
import { normalizeEmail } from "@/utils/validators.util";

const FIELDS = ["email"] as const;

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();
    setIsLoading(true);

    try {
      await authService.forgotPassword(normalizeEmail(email));
      setIsSent(true);
    } catch (err) {
      handleRequestError(
        err,
        "Link-ul de resetare nu a putut fi trimis. Încearcă din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formRef,
    email,
    setEmail: bindField(setEmail, "email"),
    fieldErrors,
    generalError,
    isLoading,
    isSent,
    handleSubmit,
  };
};

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";
import { normalizeEmail } from "@/utils/validators.util";

const FIELDS = ["email", "password"] as const;

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();
    setIsLoading(true);

    try {
      await authService.login({ email: normalizeEmail(email), password });
      navigate(from, { replace: true });
    } catch (err) {
      handleRequestError(
        err,
        "A apărut o eroare la conectarea contului. Încearcă din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formRef,
    email,
    setEmail: bindField(setEmail, "email"),
    password,
    setPassword: bindField(setPassword, "password"),
    fieldErrors,
    generalError,
    isLoading,
    handleSubmit,
  };
};

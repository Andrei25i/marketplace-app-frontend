import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { authService } from "@/services/auth.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";

const FIELDS = ["newPassword", "confirmPassword"] as const;

export const useResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    showFieldErrors,
    showGeneralError,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    if (!token) {
      showGeneralError(
        "Link-ul de resetare este invalid sau a expirat. Te rugăm să soliciți altul.",
      );
      return;
    }

    if (password !== confirmPassword) {
      showFieldErrors({ confirmPassword: "Parolele nu se potrivesc." });
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({ token, newPassword: password });

      notifications.show({
        title: "Succes",
        message: "Parola a fost resetată cu succes.",
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: 5000,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      handleRequestError(
        err,
        "A apărut o eroare la resetarea parolei. Încearcă din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formRef,
    password,
    setPassword: bindField(setPassword, "newPassword"),
    confirmPassword,
    setConfirmPassword: bindField(setConfirmPassword, "confirmPassword"),
    fieldErrors,
    generalError,
    isLoading,
    handleSubmit,
  };
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { authService } from "@/services/auth.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";

const FIELDS = ["currentPassword", "newPassword", "confirmPassword"] as const;

export const useChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    showFieldErrors,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    if (newPassword !== confirmPassword) {
      showFieldErrors({ confirmPassword: "Parolele nu se potrivesc." });
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });

      notifications.show({
        title: "Parolă schimbată",
        message: "Celelalte dispozitive au fost deconectate.",
        color: "green",
        icon: <IconCheck size={18} />,
      });

      navigate("/profile");
    } catch (err) {
      handleRequestError(
        err,
        "Parola nu a putut fi schimbată. Încearcă din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formRef,
    currentPassword,
    setCurrentPassword: bindField(setCurrentPassword, "currentPassword"),
    newPassword,
    setNewPassword: bindField(setNewPassword, "newPassword"),
    confirmPassword,
    setConfirmPassword: bindField(setConfirmPassword, "confirmPassword"),
    fieldErrors,
    generalError,
    isLoading,
    handleSubmit,
  };
};

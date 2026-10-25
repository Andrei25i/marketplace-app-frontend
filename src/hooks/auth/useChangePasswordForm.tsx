import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

export const useChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }
    if (newPassword.length < 6) {
      setError("Parola nouă trebuie să aibă minim 6 caractere.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Parola nouă trebuie să fie diferită de cea actuală.");
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
      setError(
        getErrorMessage(
          err,
          "Parola nu a putut fi schimbată. Încearcă din nou.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  };
};

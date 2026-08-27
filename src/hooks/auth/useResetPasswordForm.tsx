import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }

    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }

    if (!token) {
      setError(
        "Link-ul de resetare este invalid sau a expirat. Te rugăm să soliciți altul.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        token: token,
        newPassword: password,
      };

      // --- REQUEST PLACEHOLDER ---
      console.log("Sending to backend:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      notifications.show({
        title: "Succes",
        message: "Parola a fost resetată cu succes.",
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: 5000,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Eroare la înregistrare:", err);
      setError("A apărut o eroare la crearea contului. Încearcă din nou.");
      notifications.show({
        title: "Eroare",
        message: "Token-ul a expirat sau este invalid.",
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  };
};

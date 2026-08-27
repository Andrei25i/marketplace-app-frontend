import { useState } from "react";
import type { LoginDTO } from "@/types/auth";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: LoginDTO = {
        email: email,
        password: password,
      };

      await authService.login(payload);
      navigate("/");
    } catch (err) {
      console.error("Eroare la Login:", err);

      const errorMessage = getErrorMessage(
        err,
        "A apărut o eroare la conectarea contului. Încearcă din nou.",
      );

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};

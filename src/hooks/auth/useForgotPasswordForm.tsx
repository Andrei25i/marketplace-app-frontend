import { authService } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useState } from "react";

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      console.error("Eroare la forgot password:", err);
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
    error,
    isLoading,
    isSent,
    handleSubmit,
  };
};

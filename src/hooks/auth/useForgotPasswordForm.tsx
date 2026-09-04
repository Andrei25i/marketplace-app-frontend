import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { normalizeEmail } from "@/utils/validators.util";
import { useState } from "react";

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(normalizedEmail);
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

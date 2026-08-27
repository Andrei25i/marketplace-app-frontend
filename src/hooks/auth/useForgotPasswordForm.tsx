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
      // --- REQUEST PLACEHOLDER ---
      console.log("Request reset password for:", email);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSent(true);
    } catch (err) {
      console.error("Eroare la Login:", err);
      setError("A apărut o eroare la conectarea contului. Încearcă din nou.");
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

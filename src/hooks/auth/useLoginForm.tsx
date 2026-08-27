import { useState } from "react";
import type { LoginDTO } from "@/types/auth";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      // --- REQUEST PLACEHOLDER ---
      console.log("Sending to backend:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};

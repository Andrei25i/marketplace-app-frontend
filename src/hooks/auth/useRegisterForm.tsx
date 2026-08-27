import { useState } from "react";
import { isValidPhone } from "@/utils/validators";
import type { RegisterDTO } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { IconCheck } from "@tabler/icons-react";

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    if (isValidPhone(val) || val === "") {
      setPhone(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !county ||
      !city ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Te rugăm să introduci o adresă de email validă.");
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

    setIsLoading(true);

    try {
      const locationString = `${city}, ${county}`;
      const payload: RegisterDTO = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password,
        city: locationString,
      };

      await authService.register(payload);
      notifications.show({
        title: "Succes",
        message: "Contul a fost creat cu succes.",
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: 5000,
      });
      navigate("/");
    } catch (err) {
      console.error("Eroare la înregistrare:", err);

      const errorMessage = getErrorMessage(
        err,
        "A apărut o eroare la înregistrarea contului. Încearcă din nou.",
      );

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    handlePhoneChange,
    county,
    setCounty,
    city,
    setCity,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  };
};

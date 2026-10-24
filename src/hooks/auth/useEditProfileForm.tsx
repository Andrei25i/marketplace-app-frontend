import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import {
  isValidPhone,
  normalizeEmail,
  normalizeLocation,
  normalizeName,
  normalizePhone,
  splitLocation,
} from "@/utils/validators.util";
import type { UpdateUserData } from "@/types/auth.type";

export const useEditProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const initialLocation = splitLocation(user?.city);
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [phone, setPhone] = useState(user?.phone_number ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [county, setCounty] = useState(initialLocation.county);
  const [city, setCity] = useState(initialLocation.city);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value === "" || isValidPhone(value)) {
      setPhone(value);
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedFirstName = normalizeName(firstName);
    const normalizedLastName = normalizeName(lastName);
    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = normalizeEmail(email);
    const normalizedCounty = normalizeLocation(county);
    const normalizedCity = normalizeLocation(city);

    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedPhone ||
      !normalizedEmail ||
      !normalizedCounty ||
      !normalizedCity
    ) {
      setError("Te rugăm să completezi toate câmpurile obligatorii (*).");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: UpdateUserData = {
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        email: normalizedEmail,
        phone_number: normalizedPhone,
        city: `${normalizedCity}, ${normalizedCounty}`,
      };

      await authService.updateUser(payload);

      notifications.show({
        title: "Profil actualizat",
        message: "Datele profilului au fost salvate cu succes.",
        color: "green",
        icon: <IconCheck size={18} />,
      });

      navigate("/profile");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Profilul nu a putut fi actualizat. Încearcă din nou.",
        ),
      );
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
    email,
    setEmail,
    county,
    setCounty,
    city,
    setCity,
    error,
    isLoading,
    handleSubmit,
  };
};

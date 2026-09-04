import { useEffect, useState } from "react";
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
} from "@/utils/validators.util";
import type { UpdateUserData } from "@/types/auth.type";

export const useEditProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone_number);
    setEmail(user.email);

    const savedCity = user.city ?? "";
    const separatorIndex = savedCity.lastIndexOf(", ");

    if (separatorIndex === -1) {
      setCity(savedCity);
      return;
    }

    setCity(savedCity.slice(0, separatorIndex));
    setCounty(savedCity.slice(separatorIndex + 2));
  }, [user]);

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

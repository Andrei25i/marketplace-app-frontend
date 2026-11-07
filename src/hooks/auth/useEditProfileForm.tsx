import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useFormErrors } from "@/hooks/forms/useFormErrors";
import {
  isValidPhone,
  joinLocation,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  splitLocation,
} from "@/utils/validators.util";
import type { UpdateUserData } from "@/types/auth.type";

const FIELDS = [
  "last_name",
  "first_name",
  "email",
  "phone_number",
  "city",
] as const;

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
  const [isLoading, setIsLoading] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    clearFieldError,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value === "" || isValidPhone(value)) {
      setPhone(value);
      clearFieldError("phone_number");
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();
    setIsLoading(true);

    try {
      const payload: UpdateUserData = {
        first_name: normalizeName(firstName),
        last_name: normalizeName(lastName),
        email: normalizeEmail(email),
        phone_number: normalizePhone(phone),
        city: joinLocation(city, county),
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
      handleRequestError(
        err,
        "Profilul nu a putut fi actualizat. Încearcă din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formRef,
    firstName,
    setFirstName: bindField(setFirstName, "first_name"),
    lastName,
    setLastName: bindField(setLastName, "last_name"),
    phone,
    handlePhoneChange,
    email,
    setEmail: bindField(setEmail, "email"),
    county,
    setCounty: bindField(setCounty, "city"),
    city,
    setCity: bindField(setCity, "city"),
    fieldErrors,
    generalError,
    isLoading,
    handleSubmit,
  };
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterDTO } from "@/types/auth.type";
import { authService } from "@/services/auth.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";
import {
  isValidPhone,
  joinLocation,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "@/utils/validators.util";

const FIELDS = [
  "last_name",
  "first_name",
  "phone_number",
  "city",
  "email",
  "password",
  "confirmPassword",
] as const;

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    clearFieldError,
    showFieldErrors,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);

  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    if (isValidPhone(val) || val === "") {
      setPhone(val);
      clearFieldError("phone_number");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    if (password !== confirmPassword) {
      showFieldErrors({ confirmPassword: "Parolele nu se potrivesc." });
      return;
    }

    setIsLoading(true);

    try {
      const payload: RegisterDTO = {
        first_name: normalizeName(firstName),
        last_name: normalizeName(lastName),
        email: normalizeEmail(email),
        phone_number: normalizePhone(phone),
        password,
        city: joinLocation(city, county),
      };

      await authService.register(payload);
      navigate("/");
    } catch (err) {
      handleRequestError(
        err,
        "A apărut o eroare la înregistrarea contului. Încearcă din nou.",
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
    county,
    setCounty: bindField(setCounty, "city"),
    city,
    setCity: bindField(setCity, "city"),
    email,
    setEmail: bindField(setEmail, "email"),
    password,
    setPassword: bindField(setPassword, "password"),
    confirmPassword,
    setConfirmPassword: bindField(setConfirmPassword, "confirmPassword"),
    fieldErrors,
    generalError,
    isLoading,
    handleSubmit,
  };
};

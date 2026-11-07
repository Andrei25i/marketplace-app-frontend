import { useCategories } from "@/hooks/categories/useCategories";
import { useFormErrors } from "@/hooks/forms/useFormErrors";
import { adsService } from "@/services/ads.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { AdImage, LocalAdImage } from "@/types/ads.type";
import { AD_FORM_FIELDS, validateAdForm } from "@/utils/adForm.util";
import {
  isValidPhone,
  normalizeLocation,
  normalizePhone,
  splitLocation,
} from "@/utils/validators.util";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePostAdForm = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<LocalAdImage[]>([]);
  const [price, setPrice] = useState<number | string>("");
  const [currency, setCurrency] = useState("RON");
  const initialLocation = splitLocation(user?.city);
  const [phone, setPhone] = useState(() =>
    normalizePhone(user?.phone_number ?? ""),
  );
  const [county, setCounty] = useState(initialLocation.county);
  const [city, setCity] = useState(initialLocation.city);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    clearFieldError,
    showFieldErrors,
    handleRequestError,
    bindField,
  } = useFormErrors(AD_FORM_FIELDS);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value === "" || isValidPhone(value)) {
      setPhone(value);
      clearFieldError("phone_number");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedPhone = normalizePhone(phone);
    const normalizedCity = normalizeLocation(city);
    const normalizedCounty = normalizeLocation(county);
    const localErrors = validateAdForm({
      title: normalizedTitle,
      description: normalizedDescription,
      categoryId,
      price,
      phone: normalizedPhone,
      county: normalizedCounty,
      city: normalizedCity,
      imagesCount: images.length,
    });

    if (Object.keys(localErrors).length > 0) {
      showFieldErrors(localErrors);
      return;
    }

    setIsSubmitting(true);

    let uploadedImages: AdImage[] = [];

    try {
      uploadedImages = await adsService.uploadImages(
        images
          .map((image) => image.file)
          .filter((file): file is File => Boolean(file)),
      );

      const createdAd = await adsService.create({
        title: normalizedTitle,
        description: normalizedDescription,
        price: Number(price),
        phone_number: normalizedPhone,
        currency,
        images: uploadedImages,
        category_id: categoryId ?? "",
        city: `${normalizedCity}, ${normalizedCounty}`,
      });

      notifications.show({
        title: "Anunț postat",
        message: "Anunțul a fost postat cu succes.",
        color: "green",
        icon: <IconCheck size={18} />,
      });

      navigate(`/ads/${createdAd.id}`);
    } catch (err) {
      const publicIds = uploadedImages
        .map((image) => image.public_id)
        .filter((publicId): publicId is string => Boolean(publicId));

      if (publicIds.length > 0) {
        try {
          await adsService.deleteImages(publicIds);
        } catch (cleanupError) {
          console.error(
            "Imaginile temporare nu au putut fi șterse:",
            cleanupError,
          );
        }
      }

      handleRequestError(err, "Anunțul nu a putut fi publicat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return {
    formRef,
    title,
    setTitle: bindField(setTitle, "title"),
    description,
    setDescription: bindField(setDescription, "description"),
    images,
    setImages: bindField(setImages, "images"),
    price,
    setPrice: bindField(setPrice, "price"),
    currency,
    setCurrency: bindField(setCurrency, "currency"),
    phone,
    handlePhoneChange,
    county,
    setCounty: bindField(setCounty, "county"),
    city,
    setCity: bindField(setCity, "city"),
    categoryId,
    setCategoryId: bindField(setCategoryId, "category_id"),
    categories,
    categoriesLoading,
    categoriesError,
    fieldErrors,
    generalError,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
};

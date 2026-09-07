import { useCategories } from "@/hooks/categories/useCategories";
import { adsService } from "@/services/ads.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { AdImage, LocalAdImage } from "@/types/ads.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import {
  isValidPhone,
  normalizeLocation,
  normalizePhone,
} from "@/utils/validators.util";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
  const [phone, setPhone] = useState(user?.phone_number ?? "");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setPhone(normalizePhone(user.phone_number));

    const separatorIndex = user.city.lastIndexOf(", ");

    if (separatorIndex === -1) {
      setCity(user.city);
      return;
    }

    setCity(user.city.slice(0, separatorIndex));
    setCounty(user.city.slice(separatorIndex + 2));
  }, [user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value === "" || isValidPhone(value)) {
      setPhone(value);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const numericPrice = typeof price === "number" ? price : Number(price);
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedPhone = normalizePhone(phone);
    const normalizedCity = normalizeLocation(city);
    const normalizedCounty = normalizeLocation(county);

    if (!normalizedTitle || !normalizedDescription) {
      setError("Completează titlul și descrierea.");
      return;
    }

    if (!categoryId) {
      setError("Selectează o categorie.");
      return;
    }

    if (price === "" || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Introdu un preț mai mare decât 0.");
      return;
    }

    if (!normalizedPhone || !isValidPhone(normalizedPhone)) {
      setError("Introdu un număr de telefon valid.");
      return;
    }

    if (!normalizedCounty || !normalizedCity) {
      setError("Completează județul și localitatea.");
      return;
    }

    if (images.length === 0) {
      setError("Adaugă cel puțin o imagine.");
      return;
    }

    setIsSubmitting(true);

    let uploadedImages: AdImage[] = [];

    try {
      uploadedImages = await adsService.uploadImages(
        images.map((image) => image.file),
      );

      const createdAd = await adsService.create({
        title: normalizedTitle,
        description: normalizedDescription,
        price: numericPrice,
        phone_number: normalizedPhone,
        currency,
        images: uploadedImages,
        category_id: categoryId,
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

      setError(getErrorMessage(err, "Anunțul nu a putut fi publicat."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    images,
    setImages,
    price,
    setPrice,
    currency,
    setCurrency,
    phone,
    setPhone,
    handlePhoneChange,
    county,
    setCounty,
    city,
    setCity,
    categoryId,
    setCategoryId,
    categories,
    categoriesLoading,
    categoriesError,
    error,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
};

import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../categories/useCategories";
import { useEffect, useState } from "react";
import type { AdImage, LocalAdImage } from "@/types/ads.type";
import { adsService } from "@/services/ads.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";
import { AD_FORM_FIELDS, validateAdForm } from "@/utils/adForm.util";
import {
  isValidPhone,
  normalizeLocation,
  normalizePhone,
} from "@/utils/validators.util";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

export const useEditAdForm = (adId: string) => {
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
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

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

  useEffect(() => {
    let isMounted = true;

    const loadAd = async () => {
      try {
        const ad = await adsService.getById(adId);

        if (!isMounted) return;

        if (user && String(ad.user.id) !== String(user.id)) {
          navigate(`/ads/${adId}`, { replace: true });
          return;
        }

        setTitle(ad.title);
        setDescription(ad.description);
        setPrice(ad.price);
        setCurrency(ad.currency);
        setPhone(normalizePhone(ad.phone_number));
        setCategoryId(String(ad.category.id));

        const separatorIndex = ad.city.lastIndexOf(", ");
        if (separatorIndex === -1) {
          setCity(ad.city);
        } else {
          setCity(ad.city.slice(0, separatorIndex));
          setCounty(ad.city.slice(separatorIndex + 2));
        }

        const existingImages: LocalAdImage[] = ad.images.map((img) => ({
          preview: img.url ?? "",
          public_id: img.public_id,
        }));

        setImages(existingImages);
      } catch {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAd();

    return () => {
      isMounted = false;
    };
  }, [adId, user, navigate]);

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

    const newImages = images.filter((image) => image.file);
    let uploadedImages: AdImage[] = [];

    try {
      if (newImages.length > 0) {
        uploadedImages = await adsService.uploadImages(
          newImages.map((image) => image.file as File),
        );
      }

      let uploadCursor = 0;
      const finalImages: AdImage[] = images.map((image) =>
        image.file
          ? uploadedImages[uploadCursor++]
          : { url: image.preview, public_id: image.public_id },
      );

      const updatedAd = await adsService.update(adId, {
        title: normalizedTitle,
        description: normalizedDescription,
        price: Number(price),
        phone_number: normalizedPhone,
        currency,
        images: finalImages,
        category_id: categoryId ?? "",
        city: `${normalizedCity}, ${normalizedCounty}`,
      });

      notifications.show({
        title: "Anunț actualizat",
        message: "Modificările au fost salvate cu succes.",
        color: "green",
        icon: <IconCheck size={18} />,
      });

      navigate(`/ads/${updatedAd.id}`);
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

      handleRequestError(err, "Anunțul nu a putut fi actualizat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/ads/${adId}`);
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
    isLoading,
    isSubmitting,
    notFound,
    handleSubmit,
    handleCancel,
  };
};

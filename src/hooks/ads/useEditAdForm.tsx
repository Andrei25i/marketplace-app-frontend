import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../categories/useCategories";
import { useEffect, useState } from "react";
import type { AdImage, LocalAdImage } from "@/types/ads.type";
import { adsService } from "@/services/ads.service";
import {
  isValidPhone,
  normalizeLocation,
  normalizePhone,
} from "@/utils/validators.util";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
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
  const [initialPublicIds, setInitialPublicIds] = useState<string[]>([]);
  const [price, setPrice] = useState<number | string>("");
  const [currency, setCurrency] = useState("RON");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

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
        setInitialPublicIds(
          ad.images
            .map((img) => img.public_id)
            .filter((id): id is string => Boolean(id)),
        );
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

      const keptPublicIds = finalImages
        .map((image) => image.public_id)
        .filter((id): id is string => Boolean(id));

      const deletedPublicIds = initialPublicIds.filter(
        (id) => !keptPublicIds.includes(id),
      );

      const updatedAd = await adsService.update(adId, {
        title: normalizedTitle,
        description: normalizedDescription,
        price: numericPrice,
        phone_number: normalizedPhone,
        currency,
        images: finalImages,
        category_id: categoryId,
        city: `${normalizedCity}, ${normalizedCounty}`,
        deletedPublicIds,
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

      setError(getErrorMessage(err, "Anunțul nu a putut fi actualizat."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/ads/${adId}`);
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
    isLoading,
    isSubmitting,
    notFound,
    handleSubmit,
    handleCancel,
  };
};

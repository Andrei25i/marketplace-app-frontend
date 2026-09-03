import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "@/components/navigation/BackButton";
import { adsService } from "@/services/ads.service";
import type { AdDTO } from "@/types/ads.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import AdImageCarousel from "./carousel/AdImageCarousel";

const AdDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<AdDTO | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchAd = async () => {
      try {
        const data = await adsService.getById(id);
        setAd(data);
      } catch (err) {
        setError(getErrorMessage(err, "Nu s-a putut obține anunțul."));
      }
    };

    void fetchAd();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!ad) return <div>Se încarcă...</div>;

  return (
    <>
      <BackButton />

      <AdImageCarousel title={ad.title} images={ad.images} />
    </>
  );
};

export default AdDetails;

import { useEditAdForm } from "@/hooks/ads/useEditAdForm";
import { useParams } from "react-router-dom";
import NotFound from "../notFound/NotFound";
import AdForm from "@/components/ui/forms/AdForm";
import AdFormSkeleton from "@/components/ui/forms/AdFormSkeleton";

const HEADING = "Editează anunțul";
const SUBHEADING = "Modifică detaliile anunțului tău.";

const EditAd = () => {
  const { id } = useParams<{ id: string }>();
  const form = useEditAdForm(id!);

  if (form.isLoading)
    return <AdFormSkeleton heading={HEADING} subheading={SUBHEADING} />;
  if (form.notFound) return <NotFound />;

  return (
    <AdForm
      {...form}
      heading={HEADING}
      subheading={SUBHEADING}
      submitLabel="Salvează"
    />
  );
};

export default EditAd;

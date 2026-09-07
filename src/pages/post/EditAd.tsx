import { useEditAdForm } from "@/hooks/ads/useEditAdForm";
import { useParams } from "react-router-dom";
import NotFound from "../notFound/NotFound";
import AdForm from "@/components/ui/forms/AdForm";
import { Center, Loader } from "@mantine/core";

const EditAd = () => {
  const { id } = useParams<{ id: string }>();
  const form = useEditAdForm(id!);

  if (form.isLoading)
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  if (form.notFound) return <NotFound />;

  return (
    <AdForm
      {...form}
      heading="Editează anunțul"
      subheading="Modifică detaliile anunțului tău."
      submitLabel="Salvează"
    />
  );
};

export default EditAd;

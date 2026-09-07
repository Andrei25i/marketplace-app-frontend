import AdForm from "@/components/ui/forms/AdForm";
import { usePostAdForm } from "@/hooks/ads/usePostAdForm";

const PostAd = () => {
  const form = usePostAdForm();

  return (
    <AdForm
      {...form}
      heading="Postează un anunț"
      subheading="Completează detaliile anunțului tău."
      submitLabel="Postează"
    />
  );
};

export default PostAd;

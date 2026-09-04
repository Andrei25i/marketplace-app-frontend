import { useParams } from "react-router-dom";
import BackButton from "@/components/navigation/BackButton";
import AdImageCarousel from "./carousel/AdImageCarousel";
import useAd from "@/hooks/ads/useAd";
import AdDetailsCard from "./AdDetailsCard";
import { Box, Container, Flex } from "@mantine/core";
import SellerInfoCard from "./SellerInfoCard";

const AdDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { ad, isLoading, error, refetch } = useAd(id);

  if (error) return <div>{error}</div>;
  if (!ad) return <div>Se încarcă...</div>;

  return (
    <>
      <BackButton />

      <Container size="xl" p={0}>
        <Flex gap="xl" mt="sm" direction={{ base: "column", md: "row" }}>
          <Box
            w={{ base: "100%", md: "55%" }}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AdImageCarousel title={ad.title} images={ad.images} />
          </Box>

          <Box w={{ base: "100%", md: "45%" }}>
            <AdDetailsCard ad={ad} />
            <SellerInfoCard ad={ad} />
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default AdDetails;

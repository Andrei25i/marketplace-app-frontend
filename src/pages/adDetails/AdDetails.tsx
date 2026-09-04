import { useParams } from "react-router-dom";
import BackButton from "@/components/navigation/BackButton";
import AdImageCarousel from "./carousel/AdImageCarousel";
import useAd from "@/hooks/ads/useAd";
import AdDetailsCard from "./AdDetailsCard";
import { Box, Container, Flex } from "@mantine/core";
import SellerInfoCard from "./SellerInfoCard";
import ExpandableText from "@/components/ui/ExpandableText";

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
          <Flex
            w={{ base: "100%", md: "55%" }}
            direction="column"
            align={{ base: "center", md: "flex-start" }}
            justify="center"
            gap="md"
          >
            <AdImageCarousel title={ad.title} images={ad.images} />
          </Flex>

          <Box w={{ base: "100%", md: "45%" }}>
            <AdDetailsCard ad={ad} />
            <SellerInfoCard ad={ad} />
          </Box>
        </Flex>

        <Box mt="xl" w={{ base: "100%", md: 650 }}>
          <ExpandableText text={ad.description} />
        </Box>
      </Container>
    </>
  );
};

export default AdDetails;

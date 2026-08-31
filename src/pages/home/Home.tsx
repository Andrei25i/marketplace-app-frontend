import { Stack } from "@mantine/core";
import CategoriesSection from "./CategoriesSection";
import HeroSection from "./HeroSection";
import RecentlySection from "./RecentlySection";
import Footer from "./Footer";

const Home = () => {
  return (
    <Stack gap={80}>
      <HeroSection />
      <CategoriesSection />
      <RecentlySection />
      <Footer />
    </Stack>
  );
};

export default Home;

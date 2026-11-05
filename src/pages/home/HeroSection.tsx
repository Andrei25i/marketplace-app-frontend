import { Box, Button, TextInput, Title, Text, Overlay } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import heroDesktop from "@/assets/hero-desktop.webp";
import heroMobile from "@/assets/hero-mobile.webp";
import heroBlur from "@/assets/hero-blur.webp";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./HeroSection.module.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const isSmallMobile = useMediaQuery("(max-width: 580px)");
  const isMobile = useMediaQuery("(max-width: 800px)");

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const imageRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setIsImageLoaded(true);
  }, []);

  const searchPlaceholder = isMobile
    ? "Caută anunțuri..."
    : "Caută haine, electronice sau mobilă...";

  return (
    <Box component="section" className={classes.section}>
      <Box
        className={`${classes.heroCard} ${
          isSmallMobile ? classes.heroCardCompact : classes.heroCardDefault
        }`}
      >
        <div
          className={classes.heroPlaceholder}
          style={{ backgroundImage: `url(${heroBlur})` }}
          aria-hidden
        />

        <picture>
          <source media="(max-width: 800px)" srcSet={heroMobile} />
          <img
            ref={imageRef}
            src={heroDesktop}
            alt="Imagine interior modern"
            className={classes.heroImage}
            data-loaded={isImageLoaded || undefined}
            onLoad={() => setIsImageLoaded(true)}
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <Overlay
          gradient="linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)"
          opacity={1}
          style={{ zIndex: 1 }}
        />

        <Box
          className={`${classes.content} ${
            isSmallMobile ? classes.contentCompact : classes.contentDefault
          }`}
          w={isSmallMobile ? "100%" : "65%"}
          p={{ base: 16, sm: 20, md: 32, lg: 40 }}
        >
          <Title
            order={1}
            fw={700}
            lh={1.1}
            mb={20}
            c="white"
            className={classes.title}
          >
            Dă o nouă șansă <br /> obiectelor tale.
          </Title>

          <Text fw={500} c="white" mb={28} className={classes.subtitle}>
            Anunțuri simple, pentru lucruri de care nu mai ai nevoie.
          </Text>

          <Box className={classes.searchPanel} maw={500} w="100%" p={8}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              className={classes.searchForm}
            >
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder={searchPlaceholder}
                size={isSmallMobile ? "md" : "lg"}
                leftSection={
                  <IconSearch size={18} color="var(--mantine-color-gray-6)" />
                }
                rightSection={
                  <Button
                    type="submit"
                    radius="md"
                    size={isSmallMobile ? "xs" : "sm"}
                    className={classes.searchButton}
                  >
                    Caută
                  </Button>
                }
                rightSectionWidth={isSmallMobile ? 72 : 86}
                classNames={{
                  input: `${classes.searchInput} ${
                    isSmallMobile ? classes.searchInputCompact : ""
                  }`,
                  section: classes.searchSection,
                }}
              />
            </Box>
          </Box>

          <Button
            component={Link}
            to="/search"
            variant="transparent"
            size="sm"
            mt={24}
            p={0}
            rightSection={<IconArrowRight size={18} />}
            className={classes.linkAction}
          >
            Vezi toate anunțurile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;

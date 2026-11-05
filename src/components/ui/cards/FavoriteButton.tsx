import { ActionIcon, Button } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import classes from "./AdCard.module.css";
import { useAuthStore } from "@/store/useAuthStore";
import { useFavoriteAdsStore } from "@/store/useFavoriteStore";
import React, { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useAnimate } from "motion/react";

type FavoriteButtonProps = {
  adId: string;
  variant?: "icon" | "subtle";
};

const FavoriteButton = ({ adId, variant = "icon" }: FavoriteButtonProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoaded = useFavoriteAdsStore((state) => state.isLoaded);
  const isFavorite = useFavoriteAdsStore((state) => state.isFavorite(adId));
  const toggleFavorite = useFavoriteAdsStore((state) => state.toggleFavorite);

  const [isPending, setIsPending] = useState(false);
  const [heartRef, animate] = useAnimate<HTMLSpanElement>();
  const navigate = useNavigate();

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      notifications.show({
        title: "Autentificare necesară",
        message: "Loghează-te pentru a salva anunțurile preferate.",
        color: "yellow",
      });

      navigate("/login");
      return;
    }

    if (!isLoaded || isPending) return;

    if (!isFavorite && heartRef.current) {
      void animate(
        heartRef.current,
        { scale: [1, 1.35, 1] },
        { duration: 0.35, ease: "easeOut" },
      );
    }

    setIsPending(true);

    try {
      const wasAdded = await toggleFavorite(adId);
      notifications.show({
        title: wasAdded
          ? "Anunț adăugat la favorite"
          : "Anunț eliminat de la favorite",
        message: wasAdded
          ? "Anunțul a fost salvat în lista ta."
          : "Anunțul a fost eliminat din lista ta.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Eroare",
        message: "Nu s-a putut actualiza lista de favorite. Încearcă din nou.",
        color: "red",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (variant === "subtle") {
    return (
      <Button
        className={classes.favoriteSubtle}
        variant="subtle"
        color={isFavorite ? "red" : "dark.4"}
        size="xs"
        radius="xl"
        leftSection={
          <span ref={heartRef} style={{ display: "inline-flex" }}>
            <IconHeart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </span>
        }
        aria-label={
          isFavorite ? "Elimină de la favorite" : "Adaugă la favorite"
        }
        onClick={handleClick}
      >
        {isFavorite ? "Salvat" : "Salvează"}
      </Button>
    );
  }

  return (
    <ActionIcon
      variant="filled"
      color="white"
      c={isFavorite ? "red.6" : "dark.3"}
      radius="xl"
      size="lg"
      className={classes.favoriteBtn}
      aria-label={isFavorite ? "Elimină de la favorite" : "Adaugă la favorite"}
      onClick={handleClick}
    >
      <span ref={heartRef} style={{ display: "inline-flex" }}>
        <IconHeart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </span>
    </ActionIcon>
  );
};

export default FavoriteButton;

import { cloudinaryUrl } from "@/utils/cloudinary.util";
import { ActionIcon, Box, Loader, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import type { ReactNode } from "react";
import LoadingImage from "./LoadingImage";
import classes from "./ImageTile.module.css";

type ImageTileProps = {
  src: string;
  alt: string;
  onClick?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  width?: number | string;
  aspectRatio?: number | string;
  fit?: "cover" | "contain";
  loading?: boolean;
  selected?: boolean;
  children?: ReactNode;
};

const ImageTile = ({
  src,
  alt,
  onClick,
  onRemove,
  removeLabel = "Elimină imaginea",
  width = "100%",
  aspectRatio = 1,
  fit = "cover",
  loading = false,
  selected = false,
  children,
}: ImageTileProps) => {
  const thumbWidth = typeof width === "number" ? width * 2 : 800;

  return (
    <Box
      className={classes.tile}
      data-selected={selected || undefined}
      style={{ width, aspectRatio: String(aspectRatio) }}
    >
      <UnstyledButton
        className={classes.button}
        onClick={onClick}
        disabled={!onClick}
        aria-label={alt}
      >
        <LoadingImage
          src={cloudinaryUrl(src, { width: thumbWidth })}
          alt={alt}
          className={classes.image}
          style={{ objectFit: fit }}
          loaderSize="xs"
          loaderColor="gray"
          loading="lazy"
          draggable={false}
        />
      </UnstyledButton>

      {loading && (
        <Box className={classes.loading}>
          <Loader size="sm" color="primary.6" />
        </Box>
      )}

      {children}

      {onRemove && (
        <ActionIcon
          size="sm"
          radius="xl"
          variant="filled"
          color="dark"
          className={classes.remove}
          onClick={onRemove}
          aria-label={removeLabel}
        >
          <IconX size={14} />
        </ActionIcon>
      )}
    </Box>
  );
};

export default ImageTile;

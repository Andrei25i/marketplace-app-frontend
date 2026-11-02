import { useCallback, useState, type ImgHTMLAttributes } from "react";
import { Loader, type MantineColor, type MantineSize } from "@mantine/core";
import { IconPhotoOff } from "@tabler/icons-react";
import classes from "./LoadingImage.module.css";

type LoadingImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  loaderColor?: MantineColor;
  loaderSize?: MantineSize;
};

const LoadingImage = ({
  src,
  className,
  loaderColor = "primary",
  loaderSize = "sm",
  onLoad,
  onError,
  ...rest
}: LoadingImageProps) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const status =
    failedSrc === src ? "error" : loadedSrc === src ? "loaded" : "loading";

  const imgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) setLoadedSrc(src);
    },
    [src],
  );

  return (
    <>
      {status !== "loaded" && (
        <span className={classes.overlay}>
          {status === "loading" ? (
            <Loader size={loaderSize} color={loaderColor} />
          ) : (
            <IconPhotoOff size={28} color="var(--mantine-color-gray-5)" />
          )}
        </span>
      )}

      <img
        {...rest}
        ref={imgRef}
        src={src}
        data-status={status}
        className={`${classes.image} ${className ?? ""}`}
        onLoad={(event) => {
          setLoadedSrc(src);
          onLoad?.(event);
        }}
        onError={(event) => {
          setFailedSrc(src);
          onError?.(event);
        }}
      />
    </>
  );
};

export default LoadingImage;

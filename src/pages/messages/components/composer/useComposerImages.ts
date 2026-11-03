import { pickImageFiles } from "@/utils/chat.util";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";

export type PendingImage = { file: File; preview: string };

const useComposerImages = (onAdded?: () => void) => {
  const [images, setImages] = useState<PendingImage[]>([]);

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(
    () => () =>
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview)),
    [],
  );

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    const { accepted, problems } = pickImageFiles(incoming, images.length);
    if (problems.length > 0) {
      notifications.show({
        color: "red",
        title: "Unele imagini nu au fost adăugate",
        message: problems.join(" "),
      });
    }
    if (accepted.length === 0) return;

    setImages((prev) => [
      ...prev,
      ...accepted.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    onAdded?.();
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(images.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
  };

  return { images, addFiles, removeImage, clearImages };
};

export default useComposerImages;

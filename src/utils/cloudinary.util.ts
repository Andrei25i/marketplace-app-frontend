type CloudinaryOptions = {
  width?: number;
  height?: number;
  crop?: "limit" | "fill";
};

const UPLOAD_SEGMENT = "/image/upload/";

export const cloudinaryUrl = (
  url: string,
  { width, height, crop = "limit" }: CloudinaryOptions = {},
): string => {
  if (!url.includes("res.cloudinary.com") || !url.includes(UPLOAD_SEGMENT)) {
    return url;
  }

  const transformation = [
    `c_${crop}`,
    width && `w_${Math.round(width)}`,
    height && `h_${Math.round(height)}`,
    "q_auto",
    "f_auto",
  ]
    .filter(Boolean)
    .join(",");

  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transformation}/`);
};

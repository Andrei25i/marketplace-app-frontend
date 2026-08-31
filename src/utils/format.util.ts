export const formatPrice = (value: number | string): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) return "0";

  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

export const timeAgo = (dateInput: string | Date | number): string => {
  if (!dateInput) return "";

  const formattedInput =
    typeof dateInput === "string" ? dateInput.replace(" ", "T") : dateInput;

  const date = new Date(formattedInput);
  const now = new Date();

  if (isNaN(date.getTime())) return "dată invalidă";

  const diffInSeconds = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 1000),
  );

  const rtf = new Intl.RelativeTimeFormat("ro", { numeric: "always" });

  if (diffInSeconds < 60) {
    return "chiar acum";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.round(diffInSeconds / 60);
    return rtf.format(-minutes, "minute");
  } else if (diffInSeconds < 86400) {
    // 24 hours
    const hours = Math.round(diffInSeconds / 3600);
    return rtf.format(-hours, "hour");
  } else if (diffInSeconds < 604800) {
    // 7 days
    const days = Math.round(diffInSeconds / 86400);
    return rtf.format(-days, "day");
  } else if (diffInSeconds < 2592000) {
    // 30 days
    const weeks = Math.round(diffInSeconds / 604800);
    return rtf.format(-weeks, "week");
  } else if (diffInSeconds < 31536000) {
    // 365 days
    const months = Math.round(diffInSeconds / 2592000);
    return rtf.format(-months, "month");
  } else {
    const years = Math.round(diffInSeconds / 31536000);
    return rtf.format(-years, "year");
  }
};

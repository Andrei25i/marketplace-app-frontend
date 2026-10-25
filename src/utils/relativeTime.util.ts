const rtf = new Intl.RelativeTimeFormat("ro", { numeric: "auto" });

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export const formatRelativeTime = (value: string) => {
  const diffSeconds = (new Date(value).getTime() - Date.now()) / 1000;

  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return "chiar acum";
};

export const formatFullDate = (value: string) =>
  new Date(value).toLocaleString("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

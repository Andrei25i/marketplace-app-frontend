import type { ChatUserDTO } from "@/types/chat.type";
import { formatRelativeTime } from "./relativeTime.util";

const DAY_MS = 24 * 60 * 60 * 1000;

const timeFormatter = new Intl.DateTimeFormat("ro-RO", {
  hour: "2-digit",
  minute: "2-digit",
});

const weekdayFormatter = new Intl.DateTimeFormat("ro-RO", { weekday: "long" });

const shortDateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

const longDateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const capitalize = (value: string) =>
  value.charAt(0).toLocaleUpperCase("ro-RO") + value.slice(1);

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const daysAgo = (date: Date, now: Date = new Date()) =>
  Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);

export const isSameDay = (a: string, b: string): boolean =>
  startOfDay(new Date(a)) === startOfDay(new Date(b));

export const formatMessageTime = (iso: string): string =>
  timeFormatter.format(new Date(iso));

export const formatConversationTime = (iso: string): string => {
  const date = new Date(iso);
  const days = daysAgo(date);

  if (days <= 0) return timeFormatter.format(date);
  if (days === 1) return "Ieri";
  if (days < 7) return capitalize(weekdayFormatter.format(date));
  return shortDateFormatter.format(date);
};

export const formatDayLabel = (iso: string): string => {
  const date = new Date(iso);
  const days = daysAgo(date);

  if (days <= 0) return "Astăzi";
  if (days === 1) return "Ieri";
  if (days < 7) return capitalize(weekdayFormatter.format(date));
  return longDateFormatter.format(date);
};

export const formatLastSeen = (
  user: Pick<ChatUserDTO, "is_online" | "last_seen_at">,
): string => {
  if (user.is_online) return "Activ acum";
  if (user.last_seen_at)
    return `Văzut ${formatRelativeTime(user.last_seen_at)}`;
  return "";
};

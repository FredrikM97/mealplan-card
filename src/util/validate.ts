import type { FeedingTime } from "./serializer";

export function validateFeedingTime(
  entry: Partial<FeedingTime>,
): string | null {
  if (
    typeof entry.hour !== "number" ||
    typeof entry.minute !== "number" ||
    isNaN(entry.hour) ||
    isNaN(entry.minute) ||
    entry.hour < 0 ||
    entry.hour > 23 ||
    entry.minute < 0 ||
    entry.minute > 59
  ) {
    return "Please enter a valid time.";
  }
  if (!entry.portion || entry.portion < 1) {
    return "Portion must be at least 1.";
  }
  return null;
}

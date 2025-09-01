/**
 * Enum for days of the week, using bitmask values directly.
 */
export enum Day {
  Monday = 1 << 0,
  Tuesday = 1 << 1,
  Wednesday = 1 << 2,
  Thursday = 1 << 3,
  Friday = 1 << 4,
  Saturday = 1 << 5,
  Sunday = 1 << 6,
}

/**
 * Returns all Day enum values as an array.
 */
function getAllDays(): Day[] {
  return [
    Day.Monday,
    Day.Tuesday,
    Day.Wednesday,
    Day.Thursday,
    Day.Friday,
    Day.Saturday,
    Day.Sunday,
  ];
}

/**
 * Converts a bitmask to an array of Day enums.
 * @param mask Bitmask representing days
 * @returns Array of Day enums corresponding to set bits in the mask
 */
export function bitmaskToDays(mask: number): Day[] {
  if (!mask) return [];
  return getAllDays().filter((day) => (mask & day) !== 0);
}

/**
 * Converts an array of Day enums to a bitmask.
 * @param days Array of Day enums
 * @returns Bitmask representing the days
 */
export function daysToBitmask(days: Day[]): number {
  if (!Array.isArray(days) || days.length === 0) return 0;
  return days.reduce((mask, day) => mask | day, 0);
}

/**
 * Checks if a number is a valid bitmask for the Day enum.
 * @param mask Number to check
 * @returns True if mask only contains valid Day bits
 */
export function isValidDayBitmask(mask: number): boolean {
  const all = daysToBitmask(getAllDays());
  return (mask & ~all) === 0;
}

// Utility for UI formatting only
export function formatHourMinute(hour?: number, minute?: number): string {
  if (
    typeof hour !== "number" ||
    isNaN(hour) ||
    typeof minute !== "number" ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  )
    return "--:--";
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

import type { FeedingTime, DeviceProfile, ProfileField } from './types';

/**
 * Format time as HH:MM string
 */
export function formatTime(hour?: number, minute?: number): string {
  const h = hour ?? 0;
  const m = minute ?? 0;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Convert hour and minute to total minutes for comparison
 */
export function timeToMinutes(hour?: number, minute?: number): number {
  return (hour ?? 0) * 60 + (minute ?? 0);
}

/**
 * Check if a meal is enabled
 */
export function isMealEnabled(meal: FeedingTime): boolean {
  return meal.enabled === undefined || meal.enabled === 1;
}

/**
 * Check if a profile has a specific field
 */
export function hasProfileField(
  profile: DeviceProfile | undefined,
  field: ProfileField,
): boolean {
  return profile?.fields.includes(field) ?? false;
}

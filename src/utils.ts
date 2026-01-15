import { ProfileField, type FeedingTime, type DeviceProfile } from './types';

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

/**
 * Get the number of portion inputs supported by a profile.
 */
export function getProfilePortionCount(
  profile: DeviceProfile | undefined,
): number {
  if (profile?.portionCount !== undefined) {
    return profile.portionCount;
  }
  const template = profile?.encodingTemplate;
  if (template) {
    const re = /PORTION\[(\d+)\]/g;
    let match: RegExpExecArray | null;
    let maxIndex = -1;
    while ((match = re.exec(template)) !== null) {
      const index = parseInt(match[1], 10);
      if (!Number.isNaN(index)) {
        maxIndex = Math.max(maxIndex, index);
      }
    }
    if (maxIndex >= 0) {
      return maxIndex + 1;
    }
  }
  return 1;
}

/**
 * Compare two arrays of meals for equality using JSON comparison
 */
export function areMealsEqual(
  meals1: FeedingTime[] | null | undefined,
  meals2: FeedingTime[] | null | undefined,
): boolean {
  return JSON.stringify(meals1) === JSON.stringify(meals2);
}

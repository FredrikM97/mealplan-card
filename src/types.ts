import { EncodingType } from './profiles/serializer.js';

/**
 * Represents a single feeding time entry
 */
export interface FeedingTime {
  hour?: number;
  minute?: number;
  portion?: number;
  days?: number;
  enabled?: number;
}

/**
 * Enum for days of the week, using bitmask values directly.
 */
export enum Day {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

export interface MealPlanCardConfig {
  sensor: string;
  title: string;
  helper: string;
  portions?: number;
  profile?: DeviceProfileGroup & { selectedProfile: DeviceProfile };
}

export enum ProfileField {
  TIME = 'time',
  PORTION = 'portion',
  DAYS = 'days',
  ENABLED = 'enabled',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
}

export interface DeviceProfile {
  manufacturer: string;
  default?: boolean;
  models?: string[];
}

export interface DeviceProfileGroup {
  profiles: DeviceProfile[];
  encodingType?: EncodingType;
  fields: ProfileField[];
  encodingTemplate?: string;
  featureFields?: ProfileField[];
  firstDay?: Day;
  // Custom transformers for encoding/decoding days field
  encode?: (days: number) => number;
  decode?: (encoded: number) => number;
}

/**
 * Check if a profile is valid and ready to use
 */
export function isValidProfile(
  profile: DeviceProfileGroup | undefined | null,
): profile is DeviceProfileGroup {
  return !!profile && !!profile.encodingTemplate;
}

export const TOKEN_REGEX = /\{([A-Z_]+)\:(\d+)\}/g;

// Template field names
export enum TemplateFieldName {
  DAYS = 'DAYS',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
  PORTION = 'PORTION',
  ENABLED = 'ENABLED',
  FILL = 'FILL',
}

// Fields that use hex encoding (all others use decimal)
// For BASE64 encodingType profiles: all fields use hex
// For HEX encodingType profiles: only DAYS uses hex, others use decimal
export const HEX_FIELDS = new Set([TemplateFieldName.DAYS]);

// Helper function to create template field with length
export const f = (field: TemplateFieldName, len: number): string =>
  `{${field}:${len}}`;

/**
 * Convert bitmask to array of Day values
 */
export function bitmaskToDays(mask: number): Day[] {
  const days: Day[] = [];
  for (let i = 0; i < 7; i++) {
    if (mask & (1 << i)) {
      days.push(i as Day);
    }
  }
  return days;
}

/**
 * Convert array of Day values to bitmask
 */
export function daysToBitmask(days: Day[]): number {
  return days.reduce((mask, day) => mask | (1 << day), 0);
}

/**
 * Check if a bitmask is valid (only uses bits 0-6)
 */
export function isValidDayBitmask(mask: number): boolean {
  return (mask & ~0x7f) === 0;
}

/**
 * Format hour and minute as HH:MM string
 */
export function formatHourMinute(hour?: number, minute?: number): string {
  if (
    typeof hour !== 'number' ||
    isNaN(hour) ||
    typeof minute !== 'number' ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  )
    return '--:--';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

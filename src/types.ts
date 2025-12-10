import { EncodingType } from './profiles/serializer';

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
 * Edit meal state containing a meal and optional index
 */
export interface EditMealState {
  meal: FeedingTime;
  index?: number;
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
  profile?: DeviceProfile;
  selectedModel?: string;
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

/**
 * Device profile with manufacturer, models, and encoding configuration
 */
export interface DeviceProfile {
  manufacturer: string;
  models: string[];
  encodingType?: EncodingType;
  fields: ProfileField[];
  encodingTemplate: string;
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
  profile: DeviceProfile | undefined | null,
): profile is DeviceProfile {
  return profile !== undefined && profile !== null;
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

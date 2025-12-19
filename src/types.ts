/**
 * JSON data structures that can contain feeding time data (arrays or objects).
 * Excludes primitives since device data is always structured.
 */
export type JsonObject = { [key: string]: unknown } | unknown[];

/**
 * Device-encoded feeding time data that can be serialized.
 * This is the output of encode transformers - either individual entries, arrays, or wrapped structures.
 */
export type EncodedFeedingData =
  | FeedingTime
  | FeedingTime[]
  | FeedingTimeWithStringDays
  | FeedingTimeWithStringDays[]
  | Record<string, unknown>;

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
 * FeedingTime variant where days can be either a number (bitmask) or a string (e.g., "everyday").
 * Used by device transformers that encode/decode string-based day representations.
 */
export type FeedingTimeWithStringDays = FeedingTime & {
  days?: string | number;
};

/**
 * Handler for meal actions (edit, delete, update)
 */
export type MealActionHandler = (
  action: 'update' | 'delete' | 'edit',
  index: number,
  meal: FeedingTime,
) => void;

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
  helper?: string;
  portions?: number;
  manufacturer?: string;
  model?: string;
  transport_type: TransportType;
}

export enum ProfileField {
  TIME = 'time',
  PORTION = 'portion',
  SIZE = 'size',
  DAYS = 'days',
  ENABLED = 'enabled',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
}

export enum TransportType {
  SENSOR = 'sensor', // Write via sensor.set_value (default)
  MQTT = 'mqtt', // Write via mqtt.publish
}

/**
 * Device profile with manufacturer, models, and encoding configuration
 */
export interface DeviceProfile {
  manufacturer: string;
  models: string[];
  encodingType: EncodingType;
  fields: ProfileField[];
  encodingTemplate?: string;
  featureFields?: ProfileField[];
  /**
   * Custom transformer for encoding data before sending to device.
   * Returns structured feeding time data in device-specific format.
   */
  encode?: (data: FeedingTime | FeedingTime[]) => EncodedFeedingData;
  /**
   * Custom transformer for decoding data received from device.
   * Converts device-specific format back to app's FeedingTime format.
   */
  decode?: (data: JsonObject) => FeedingTime | FeedingTime[];
}

/**
 * Home Assistant instance
 */
export interface HomeAssistant {
  states: Record<
    string,
    { state: string; attributes: Record<string, unknown> }
  >;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<void>;
  language: string;
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

export enum EncodingType {
  BASE64 = 'base64',
  HEX = 'hex',
  DICT = 'dict',
}

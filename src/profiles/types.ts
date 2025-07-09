// Types and schema for device profiles


// Enum for all UI/feature fields (can be shown in the editor or as toggles)
export enum ProfileField {
  TIME = 'time',
  PORTION = 'portion',
  DAYS = 'days',
  ENABLED = 'enabled',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
}

// Enum for fields that can be encoded/decoded in meal plan data
export enum EncodingField {
  DAYS = 'days',
  HOUR = 'hour',
  MINUTE = 'minute',
  PORTION = 'portion',
  ENABLED = 'enabled',
}

export interface DeviceProfile {
  manufacturer: string;
  default?: boolean;
  models?: string[];
}

/**
 * DeviceProfileGroup
 * - fields: UI fields shown in the schedule editor (order matters, e.g. [Time, Portion, DaysMask, ...])
 * - encodingFields: fields used for encoding/decoding the meal plan data (order matters, e.g. [Hour, Minute, Portion, ...])
 * These are intentionally different: not all UI fields are encoded, and not all encoded fields are shown in the UI.
 */
export interface DeviceProfileGroup {
  profiles: DeviceProfile[];
  fields: ProfileField[]; // UI fields for the schedule editor (order matters)
  encodingFields: EncodingField[]; // Only fields that can be encoded/decoded (order matters)
  /**
   * featureFields: Optional fields that represent device-specific features (e.g. DaysMask, Enabled, etc).
   * Used to enable/disable or display feature toggles in the UI, but not necessarily shown as columns or encoded.
   */
  featureFields?: ProfileField[];
  // ...other shared config fields
}

// Add any other types needed for the unified profile structure here

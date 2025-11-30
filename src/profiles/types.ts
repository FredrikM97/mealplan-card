import { Day } from '../util/days-util';
import { EncodingType } from '../util/serializer';

export const TOKEN_REGEX = /\{([A-Z_]+)\:(\d+)\}/g;

export enum ProfileField {
  TIME = 'time',
  PORTION = 'portion',
  DAYS = 'days',
  ENABLED = 'enabled',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
}

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

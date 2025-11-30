import { Day } from '../util/days-util';
import { EncodingType } from '../util/serializer';

export enum ProfileField {
  TIME = 'time',
  PORTION = 'portion',
  DAYS = 'days',
  ENABLED = 'enabled',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
}

// Encoding template field names with their type built-in
export enum TemplateField {
  DAYS = 'DAYS:h',
  HOUR = 'HOUR:h',
  MINUTE = 'MINUTE:h',
  PORTION = 'PORTION:h',
  ENABLED = 'ENABLED:h',
  FILL = 'FILL:h',
}

export enum TemplateFieldDecimal {
  DAYS = 'DAYS:d',
  HOUR = 'HOUR:d',
  MINUTE = 'MINUTE:d',
  PORTION = 'PORTION:d',
  ENABLED = 'ENABLED:d',
}

// Helper function to create template field with length
export const f = (
  field: TemplateField | TemplateFieldDecimal,
  len: number,
): string => `{${field}${len}}`;

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
}

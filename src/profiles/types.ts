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

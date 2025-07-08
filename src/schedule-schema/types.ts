
import { ScheduleFeatureFieldKey, ScheduleEncodingFieldKey } from './fields';

export type LayoutField = string;

export interface LayoutDef {
  name: string;
  entrySize: number;
  fields: LayoutField[];
}


export interface DeviceProfile {
  id: string;
  name: string;
  maxSchedules?: number;
  minSchedules?: number;
  fields: ScheduleFeatureFieldKey[];
  encodingFields?: ScheduleEncodingFieldKey[];
}


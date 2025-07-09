// Deprecated: schedule-schema/types.ts is no longer used. See src/profiles/.

export type LayoutField = string;

export interface LayoutDef {
  name: string;
  entrySize: number;
  fields: LayoutField[];
}

export interface DeviceModelConfig {
  id: string;
  manufacturer: string;
  name?: string;
  maxSchedules?: number;
  minSchedules?: number;
  fields: ScheduleFeatureFieldKey[];
  encodingFields?: ScheduleEncodingFieldKey[];
}

// New: Grouped config structure for shared config between manufacturers/models
export interface DeviceProfileGroup {
  profiles: Array<{
    manufacturer: string;
    models: string[];
  }>;
  maxSchedules?: number;
  minSchedules?: number;
  fields: ScheduleFeatureFieldKey[];
  encodingFields?: ScheduleEncodingFieldKey[];
}

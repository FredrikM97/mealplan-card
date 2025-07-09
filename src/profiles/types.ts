export enum ProfileField {
  TIME = "time",
  PORTION = "portion",
  DAYS = "days",
  ENABLED = "enabled",
  EDIT = "edit",
  DELETE = "delete",
  ADD = "add",
}

export enum EncodingField {
  DAYS = "days",
  HOUR = "hour",
  MINUTE = "minute",
  PORTION = "portion",
  ENABLED = "enabled",
}

export interface DeviceProfile {
  manufacturer: string;
  default?: boolean;
  models?: string[];
}

export interface DeviceProfileGroup {
  profiles: DeviceProfile[];
  fields: ProfileField[]; 
  encodingFields: EncodingField[]; 
  featureFields?: ProfileField[];
}

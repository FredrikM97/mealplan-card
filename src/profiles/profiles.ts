// Unified grouped config for all supported device profiles
import type { DeviceProfileGroup } from "./types";

import { ProfileField as pf, EncodingField as ef } from "./types";

export const profiles: DeviceProfileGroup[] = [
  {
    profiles: [{ manufacturer: "Cleverio", default: true, models: [] }],
    fields: [
      pf.TIME,
      pf.PORTION,
      pf.DAYS,
      pf.ENABLED,
      pf.EDIT,
      pf.DELETE,
      pf.ADD,
    ],
    encodingFields: [ef.DAYS, ef.HOUR, ef.MINUTE, ef.PORTION, ef.ENABLED],
  },
  {
    profiles: [{ manufacturer: "HoneyGuardian", default: true, models: [] }],
    fields: [pf.TIME, pf.PORTION, pf.ENABLED, pf.EDIT],
    encodingFields: [ef.HOUR, ef.MINUTE, ef.PORTION, ef.ENABLED],
  },
  {
    profiles: [{ manufacturer: "PetNest", default: true, models: [] }],
    fields: [pf.TIME, pf.PORTION, pf.DAYS, pf.EDIT, pf.DELETE, pf.ADD],
    encodingFields: [ef.DAYS, ef.PORTION, ef.MINUTE_LOW, ef.MINUTE_HIGH],
  },
  {
    profiles: [{ manufacturer: "Fukumaru-W", default: true, models: [] }],
    fields: [pf.TIME, pf.PORTION, pf.DAYS, pf.ENABLED, pf.EDIT, pf.DELETE, pf.ADD],
    encodingFields: [ef.DAYS, ef.HOUR, ef.MINUTE, ef.PORTION, ef.ENABLED],
  }
];

// Unified grouped config for all supported device profiles
import { Day } from '../util/days-util';
import { EncodingType } from '../util/serializer';
import type { DeviceProfileGroup } from './types';

import { ProfileField as pf, EncodingField as ef } from './types';

export const profiles: DeviceProfileGroup[] = [
  {
    profiles: [{ manufacturer: 'Cleverio', default: true, models: [] }],
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
    profiles: [{ manufacturer: 'HoneyGuardian', default: true, models: [] }],
    fields: [pf.TIME, pf.PORTION, pf.ENABLED, pf.EDIT],
    encodingFields: [ef.HOUR, ef.MINUTE, ef.PORTION, ef.ENABLED],
  },
  {
    profiles: [{ manufacturer: 'Fukumaru-W', default: true, models: [] }],
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
    profiles: [{ manufacturer: 'Yuposl', default: true, models: [] }],
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
    profiles: [{ manufacturer: 'Arlec', default: true, models: [] }],
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
    profiles: [{ manufacturer: 'PetLibro', default: true, models: [] }],
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
    profiles: [{ manufacturer: 'MolyPet', default: true, models: [] }],
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
    profiles: [{ manufacturer: 'PetNest', default: true, models: [] }],
    encodingType: EncodingType.HEX,
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
    profiles: [{ manufacturer: 'Petrust', default: true, models: [] }],
    firstDay: Day.Saturday,
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
    profiles: [{ manufacturer: 'Meowmatic', default: true, models: [] }],
    firstDay: Day.Saturday,
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
];

import { Day } from '../types.js';
import { EncodingType } from './serializer';
import type { DeviceProfileGroup } from '../types.js';
import { ProfileField as pf, TemplateFieldName as F, f } from '../types.js';

/**
 * Day transformer for Puppy Kitty devices.
 * Puppy Kitty uses non-standard day bit order:
 * Standard: bit 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
 * Puppy Kitty: bit 0=Sat, 1=Fri, 2=Thu, 3=Wed, 4=Mon, 5=Tue, 6=Sun
 */
const createDayTransformer = (map: number[][]) => ({
  encode: (standardDays: number) => {
    let encoded = 0;
    map.forEach(([std, custom]) => {
      if (standardDays & (1 << std)) encoded |= 1 << custom;
    });
    return encoded;
  },
  decode: (encoded: number) => {
    let standardDays = 0;
    map.forEach(([std, custom]) => {
      if (encoded & (1 << custom)) standardDays |= 1 << std;
    });
    return standardDays;
  },
});

const puppyKittyDayTransformer = createDayTransformer([
  [5, 0], // Sat
  [4, 1], // Fri
  [3, 2], // Thu
  [2, 3], // Wed
  [0, 4], // Mon
  [1, 5], // Tue
  [6, 6], // Sun
]);

// Common encoding templates
const TEMPLATE_FULL = `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 2)}`;
const TEMPLATE_NO_DAYS = `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 2)}`;

// Common field configurations
const FIELDS_FULL = [
  pf.TIME,
  pf.PORTION,
  pf.DAYS,
  pf.ENABLED,
  pf.EDIT,
  pf.DELETE,
  pf.ADD,
];
const FIELDS_MINIMAL = [pf.TIME, pf.PORTION, pf.ENABLED, pf.EDIT];

export const profiles: DeviceProfileGroup[] = [
  {
    profiles: [{ manufacturer: 'Cleverio', default: true, models: ['PF100'] }],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'HoneyGuardian', default: true, models: [] }],
    encodingTemplate: TEMPLATE_NO_DAYS,
    fields: FIELDS_MINIMAL,
  },
  {
    profiles: [{ manufacturer: 'Fukumaru-W', default: true, models: [] }],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'Yuposl', default: true, models: [] }],
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'Arlec', default: true, models: [] }],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'PetLibro', default: true, models: [] }],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'MolyPet', default: true, models: [] }],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'PetNest', default: true, models: [] }],
    encodingType: EncodingType.HEX,
    encodingTemplate: `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 1)}${f(F.FILL, 6)}`,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'Petrust', default: true, models: [] }],
    encodingType: EncodingType.BASE64,
    firstDay: Day.Saturday,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'Meowmatic', default: true, models: [] }],
    encodingType: EncodingType.BASE64,
    firstDay: Day.Saturday,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    profiles: [{ manufacturer: 'Puppy Kitty', default: true, models: [] }],
    encodingType: EncodingType.HEX,
    firstDay: Day.Saturday,
    encodingTemplate: `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 1)}${f(F.ENABLED, 1)}`,
    fields: FIELDS_FULL,
    ...puppyKittyDayTransformer,
  },
];

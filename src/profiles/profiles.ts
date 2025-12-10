import { Day, ProfileField as pf, TemplateFieldName as F, f } from '../types';
import type { DeviceProfile } from '../types';
import { EncodingType } from './serializer';

/**
 * Day transformer for Puppy Kitty devices.
 * Puppy Kitty uses non-standard day bit order:
 * Standard: bit 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
 * Puppy Kitty: bit 0=Sat, 1=Fri, 2=Thu, 3=Wed, 4=Mon, 5=Tue, 6=Sun
 */
const createDayTransformer = (map: [number, number][]) => ({
  encode: (standardDays: number) => {
    let encoded = 0;
    map.forEach(([std, custom]) => {
      if (standardDays & (1 << std)) {
        encoded |= 1 << custom;
      }
    });
    return encoded;
  },
  decode: (encoded: number) => {
    let standardDays = 0;
    map.forEach(([std, custom]) => {
      if (encoded & (1 << custom)) {
        standardDays |= 1 << std;
      }
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

export const profiles: DeviceProfile[] = [
  {
    manufacturer: 'Cleverio',
    models: ['PF100'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'HoneyGuardian',
    models: [],
    encodingTemplate: TEMPLATE_NO_DAYS,
    fields: FIELDS_MINIMAL,
  },
  {
    manufacturer: 'Fukumaru-W',
    models: [],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Yuposl',
    models: [],
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Arlec',
    models: [],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'PetLibro',
    models: [],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'MolyPet',
    models: [],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'PetNest',
    models: [],
    encodingType: EncodingType.HEX,
    encodingTemplate: `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 1)}${f(F.FILL, 6)}`,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Petrust',
    models: [],
    encodingType: EncodingType.BASE64,
    firstDay: Day.Saturday,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Meowmatic',
    models: [],
    encodingType: EncodingType.BASE64,
    firstDay: Day.Saturday,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Puppy Kitty',
    models: [],
    encodingType: EncodingType.HEX,
    firstDay: Day.Saturday,
    encodingTemplate: `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 1)}${f(F.ENABLED, 1)}`,
    fields: FIELDS_FULL,
    ...puppyKittyDayTransformer,
  },
];

import {
  ProfileField as pf,
  TemplateFieldName as F,
  f,
  EncodingType,
} from '../types';
import type { DeviceProfile } from '../types';
import {
  combineTransformers,
  createDayTransformer,
  createDictEncoderWithWrapper,
  createFieldMapTransformer,
  createPackedTimeTransformer,
  createStringDayTransformer,
} from './transformers';

// Common encoding templates
const TEMPLATE_FULL = `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 2)}`;
const TEMPLATE_NO_DAYS = `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 2)}`;

// Default day bit mapping: internal bit 0 (Mon) .. bit 6 (Sun) maps to device bit 6 (Mon) .. bit 0 (Sun)
const STANDARD_DAY_MAP: [number, number][] = [
  [0, 6], // Mon
  [1, 5], // Tue
  [2, 4], // Wed
  [3, 3], // Thu
  [4, 2], // Fri
  [5, 1], // Sat
  [6, 0], // Sun
];

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

const baseProfiles: DeviceProfile[] = [
  {
    manufacturer: 'Cleverio',
    models: ['PF100'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'HoneyGuardian',
    models: ['S56'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_NO_DAYS,
    fields: FIELDS_MINIMAL,
  },
  {
    manufacturer: 'Fukumaru-W',
    models: ['f1y6wo'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Yuposl',
    models: ['enyxp8'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Arlec',
    models: ['PF002HA'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'PetLibro',
    models: ['000004ajdj'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'MolyPet',
    models: ['F02W'],
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
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Meowmatic',
    models: [],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Puppy Kitty',
    models: [],
    encodingType: EncodingType.HEX,
    encodingTemplate: `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 1)}${f(F.ENABLED, 1)}`,
    fields: FIELDS_FULL,
    transformers: [
      createDayTransformer([
        // Custom formatting on this device
        [5, 0], // Sat
        [4, 1], // Fri
        [3, 2], // Thu
        [2, 3], // Wed
        [0, 4], // Mon
        [1, 5], // Tue
        [6, 6], // Sun
      ]),
    ],
  },
  {
    manufacturer: 'Aqara',
    models: ['C1'],
    encodingType: EncodingType.DICT,
    fields: [pf.TIME, pf.SIZE, pf.DAYS, pf.EDIT, pf.DELETE, pf.ADD],
    transformers: [
      createStringDayTransformer({
        127: 'everyday', // 0b1111111 - all days
        31: 'workdays', // 0b0011111 - Mon-Fri
        96: 'weekend', // 0b1100000 - Sat-Sun
        1: 'mon', // 0b0000001
        2: 'tue', // 0b0000010
        4: 'wed', // 0b0000100
        8: 'thu', // 0b0001000
        16: 'fri', // 0b0010000
        32: 'sat', // 0b0100000
        64: 'sun', // 0b1000000
        85: 'mon-wed-fri-sun', // 0b1010101 - Mon(1) + Wed(4) + Fri(16) + Sun(64)
        42: 'tue-thu-sat', // 0b0101010 - Tue(2) + Thu(8) + Sat(32)
      }),
      createFieldMapTransformer({ portion: 'size' }), // Map internal 'portion' to device 'size'
      createDictEncoderWithWrapper('schedule'),
    ],
  },
  {
    manufacturer: 'Wuipet',
    models: ['du4l-wc-01'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Pixi',
    models: [],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Rojeco',
    models: ['2L Pet Feeder'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'WellToBe',
    models: ['WB S36D'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_NO_DAYS,
    fields: FIELDS_MINIMAL,
  },
  {
    manufacturer: 'Kalado',
    models: ['KPF01'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: TEMPLATE_FULL,
    fields: FIELDS_FULL,
  },
  {
    manufacturer: 'Faroro',
    models: ['PF22'],
    encodingType: EncodingType.HEX,
    encodingTemplate: `${f(F.DAYS, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 1)}${f(F.FILL, 6)}`,
    fields: FIELDS_FULL,
    transformers: [
      createDayTransformer([
        [5, 0], // Sat
        [4, 1], // Fri
        [3, 2], // Thu
        [2, 3], // Wed
        [1, 4], // Tue
        [0, 5], // Mon
        [6, 6], // Sun
      ]),
    ],
  },
  {
    manufacturer: 'Tesla Smart',
    models: ['TSL-PC-059DW'],
    encodingType: EncodingType.BASE64,
    encodingTemplate: `${f(F.ENABLED, 2)}${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.DAYS, 2)}`,
    fields: FIELDS_FULL,
    // Time is stored as a big-endian 16-bit minutes-since-midnight value split across the HOUR/MINUTE bytes
    transformers: [
      createPackedTimeTransformer(),
      createDayTransformer(STANDARD_DAY_MAP),
    ],
  },
];

/**
 * Resolves a base profile's `transformers` pipeline (or the default day transformer)
 * into concrete encode/decode functions.
 */
function resolveProfile(profile: DeviceProfile): DeviceProfile {
  if (profile.encode || profile.decode) {
    return profile;
  }

  // A profile-declared pipeline takes precedence over the default day transformer
  if (profile.transformers && profile.transformers.length > 0) {
    return { ...profile, ...combineTransformers(profile.transformers) };
  }

  if (!profile.fields.includes(pf.DAYS)) {
    return profile;
  }

  // Apply default identity transformer
  return { ...profile, ...createDayTransformer(STANDARD_DAY_MAP) };
}

// Profiles with their transformer pipelines resolved into working encode/decode functions
export const profiles: DeviceProfile[] = baseProfiles.map(resolveProfile);

/**
 * Get a profile with its transformer pipeline applied
 */
export function getProfileWithTransformer(
  manufacturer: string,
): DeviceProfile | undefined {
  return profiles.find((p) => p.manufacturer === manufacturer);
}

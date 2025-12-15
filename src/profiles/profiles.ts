import { Day, ProfileField as pf, TemplateFieldName as F, f } from '../types';
import type { DeviceProfile } from '../types';
import {
  EncodingType,
  createDayTransformer,
  createFirstDayTransformer,
} from './serializer';

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
    ...createDayTransformer([
      // Custom formatting on this device
      [5, 0], // Sat
      [4, 1], // Fri
      [3, 2], // Thu
      [2, 3], // Wed
      [0, 4], // Mon
      [1, 5], // Tue
      [6, 6], // Sun
    ]),
  },
];

// Apply default transformer to profiles that don't have custom transformers
export const profiles: DeviceProfile[] = baseProfiles.map((profile) => {
  // Skip if profile already has encode/decode (custom transformer)
  if (profile.encode || profile.decode) {
    return profile;
  }
  // Skip if profile doesn't have DAYS field
  if (!profile.fields.includes(pf.DAYS)) {
    return profile;
  }
  // Apply default Monday-first transformer (identity transformation)
  return { ...profile, ...createFirstDayTransformer(Day.Sunday) };
});

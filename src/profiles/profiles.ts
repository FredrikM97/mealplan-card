import { ProfileField as pf, TemplateFieldName as F, f } from '../types';
import type { DeviceProfile } from '../types';
import { EncodingType, createDayTransformer } from './serializer';

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

// Export base profiles directly - transformers will be added lazily when needed
export const profiles: DeviceProfile[] = baseProfiles;

/**
 * Get a profile with its transformer applied (lazy initialization)
 */
export function getProfileWithTransformer(
  manufacturer: string,
): DeviceProfile | undefined {
  const profile = baseProfiles.find((p) => p.manufacturer === manufacturer);

  if (!profile) return undefined;

  // Return as-is if it already has encode/decode or doesn't need DAYS transformer
  if (profile.encode || profile.decode || !profile.fields.includes(pf.DAYS)) {
    return profile;
  }

  // Apply default identity transformer
  const transformer = createDayTransformer([
    [0, 6], // Mon
    [1, 5], // Tue
    [2, 4], // Wed
    [3, 3], // Thu
    [4, 2], // Fri
    [5, 1], // Sat
    [6, 0], // Sun
  ]);

  return {
    ...profile,
    ...transformer,
  };
}

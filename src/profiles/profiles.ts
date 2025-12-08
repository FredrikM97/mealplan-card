import { Day } from '../util/days-util';
import { EncodingType } from '../util/serializer';
import type { DeviceProfileGroup } from './types';
import { ProfileField as pf, TemplateFieldName as F, f } from './types';
import { puppyKittyDayTransformer } from './dayTransformers';

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

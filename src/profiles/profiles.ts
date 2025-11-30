import { Day } from '../util/days-util';
import { EncodingType } from '../util/serializer';
import type { DeviceProfileGroup } from './types';
import {
  ProfileField as pf,
  TemplateField as TF,
  TemplateFieldDecimal as TFD,
  f,
} from './types';

// Common encoding templates
const TEMPLATE_FULL = `${f(TF.DAYS, 2)}${f(TF.HOUR, 2)}${f(TF.MINUTE, 2)}${f(TF.PORTION, 2)}${f(TF.ENABLED, 2)}`;
const TEMPLATE_NO_DAYS = `${f(TF.HOUR, 2)}${f(TF.MINUTE, 2)}${f(TF.PORTION, 2)}${f(TF.ENABLED, 2)}`;

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
    profiles: [{ manufacturer: 'Cleverio', default: true, models: [] }],
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
    encodingTemplate: `${f(TF.DAYS, 2)}${f(TFD.HOUR, 2)}${f(TFD.MINUTE, 2)}${f(TFD.PORTION, 2)}${f(TFD.ENABLED, 1)}${f(TF.FILL, 6)}`,
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
];

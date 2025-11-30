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
  },
  {
    profiles: [{ manufacturer: 'HoneyGuardian', default: true, models: [] }],
    fields: [pf.TIME, pf.PORTION, pf.ENABLED, pf.EDIT],
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
    encodingTemplate: '{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}',
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
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
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
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
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
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
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
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
  },
  {
    profiles: [{ manufacturer: 'PetNest', default: true, models: [] }],
    encodingType: EncodingType.HEX,
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
    fields: [
      pf.TIME,
      pf.PORTION,
      pf.DAYS,
      pf.ENABLED,
      pf.EDIT,
      pf.DELETE,
      pf.ADD,
    ],
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
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
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
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
    encodingTemplate:
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}',
  },
];

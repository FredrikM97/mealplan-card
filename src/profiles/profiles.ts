// Unified grouped config for all supported device profiles
import type { DeviceProfileGroup } from './types';

import { ProfileField as pf, EncodingField as ef } from './types';

export const profiles: DeviceProfileGroup[] = [
  {
    profiles: [
      { manufacturer: 'Cleverio', default: true, models: [] }
    ],
    // UI fields for Cleverio schedule editor
    fields: [
      pf.TIME,      // time picker
      pf.PORTION,   // portion size
      pf.MASK, // days of week selector
      pf.ENABLED,   // enable/disable
      pf.EDIT,      // edit button
      pf.DELETE,    // delete button
      pf.ADD        // add button
    ],
    // Fields used for encoding/decoding Cleverio meal plan data
    encodingFields: [
      ef.DAYS,      // days (bitmask or array)
      ef.HOUR,      // hour (from time)
      ef.MINUTE,    // minute (from time)
      ef.PORTION,   // portion size
      ef.ENABLED    // enable/disable
    ]
  },
  {
    profiles: [
      { manufacturer: 'HoneyGuardian', default: true, models: [] }
    ],
    // UI fields for HoneyGuardian schedule editor
    fields: [
      pf.TIME,      // time picker
      pf.PORTION,   // portion size
      pf.ENABLED,   // enable/disable
      pf.EDIT,      // edit button
      pf.DELETE,    // delete button
      pf.ADD        // add button
    ],
    // Fields used for encoding/decoding HoneyGuardian meal plan data
    encodingFields: [
      ef.HOUR,      // hour (from time)
      ef.MINUTE,    // minute (from time)
      ef.PORTION,   // portion size
      ef.ENABLED    // enable/disable
    ]
  }
];

// Enforce only one default per manufacturer per group and presence of models array
for (const group of profiles) {
  const defaultCounts: Record<string, number> = {};
  for (const p of group.profiles) {
    // Ensure models array is always present
    if (!('models' in p) || !Array.isArray(p.models)) {
      throw new Error(`Device profile for manufacturer '${p.manufacturer}' is missing a 'models' array.`);
    }
    if (p.default) {
      defaultCounts[p.manufacturer] = (defaultCounts[p.manufacturer] || 0) + 1;
    }
  }
  for (const [manufacturer, count] of Object.entries(defaultCounts)) {
    if (count > 1) {
      throw new Error(`Device profile group for manufacturer '${manufacturer}' has ${count} defaults (should be only one).`);
    }
  }
}

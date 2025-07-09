
// Deprecated: schedule-schema/profiles.ts is no longer used. See src/profiles/.

const defaultFields = [
  ff.TIME,
  ff.PORTIONS,
  ff.DAYS,
  ff.ENABLE,
  ff.EDIT,
  ff.DELETE,
  ff.ADD,
];

const defaultEncodingFields = [
  ef.DAYS,
  ef.HOUR,
  ef.MINUTE,
  ef.PORTIONS,
  ef.ENABLE,
];

export const profiles: DeviceProfileGroup[] = [
  {
    profiles: [
      { manufacturer: 'Cleverio', models: [] }, // Only one model, no need for 'default'
    ],
    maxSchedules: 10,
    minSchedules: 0,
    fields: defaultFields,
    encodingFields: defaultEncodingFields,
  },
  {
    profiles: [
      { manufacturer: 'HoneyGuardian', models: [] }, 
    ],
    maxSchedules: 6,
    minSchedules: 6,
    fields: [
        ff.TIME,
        ff.PORTIONS,
        ff.ENABLE,
        ff.EDIT,
    ],
    encodingFields: [
      ef.HOUR,
      ef.MINUTE,
      ef.PORTIONS,
      ef.ENABLE
    ],
  },
];

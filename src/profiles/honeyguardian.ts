import { DeviceProfile } from '../schedule-schema/types';
import { ScheduleFeatureFieldKey, ScheduleEncodingFieldKey } from '../schedule-schema/fields';

export const honeyguardianProfile: DeviceProfile = {
  id: 'honeyguardian',
  name: 'Honeyguardian Feeder',
  minSchedules: 6,
  maxSchedules: 6,
  fields: [
    ScheduleFeatureFieldKey.TIME,
    ScheduleFeatureFieldKey.PORTIONS,
    ScheduleFeatureFieldKey.ENABLE,
    ScheduleFeatureFieldKey.EDIT,
  ],
  encodingFields: [
    ScheduleEncodingFieldKey.HOUR,
    ScheduleEncodingFieldKey.MINUTE,
    ScheduleEncodingFieldKey.PORTIONS,
    ScheduleEncodingFieldKey.ENABLE,
  ],
};
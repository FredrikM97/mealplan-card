import { DeviceProfile } from '../schedule-schema/types';
import { ScheduleFeatureFieldKey, ScheduleEncodingFieldKey } from '../schedule-schema/fields';

/**
 * Honeyguardian Feeder profile
 * - fields: controls UI columns and order (add ENABLE, EDIT, DELETE for full UI support)
 * - encodingFields: only fields actually encoded in the device's data format
 */
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
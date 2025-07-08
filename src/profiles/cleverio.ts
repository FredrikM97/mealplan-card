
import { DeviceProfile } from '../schedule-schema/types';
import { ScheduleFeatureFieldKey, ScheduleEncodingFieldKey } from '../schedule-schema/fields';

/**
 * Cleverio PF100 Feeder profile
 * - fields: controls UI columns and order (add ENABLE, EDIT, DELETE for full UI support)
 * - encodingFields: only fields actually encoded in the device's data format
 */
export const cleverioProfile: DeviceProfile = {
  id: 'cleverio',
  name: 'Cleverio PF100',
  maxSchedules: 10,
  minSchedules: 0,
  fields: [
    ScheduleFeatureFieldKey.TIME,
    ScheduleFeatureFieldKey.PORTIONS,
    ScheduleFeatureFieldKey.DAYS,
    ScheduleFeatureFieldKey.ENABLE,
    ScheduleFeatureFieldKey.EDIT,
    ScheduleFeatureFieldKey.DELETE,
    ScheduleFeatureFieldKey.ADD,
  ],
  encodingFields: [
    ScheduleEncodingFieldKey.DAYS, 
    ScheduleEncodingFieldKey.HOUR,    
    ScheduleEncodingFieldKey.MINUTE,  
    ScheduleEncodingFieldKey.PORTIONS,
    ScheduleEncodingFieldKey.ENABLE, 
  ],
};

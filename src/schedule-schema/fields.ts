// For encoding/decoding (property names in FeedingTime)
export enum ScheduleEncodingFieldKey {
  ENABLE = 'enabled',
  HOUR = 'hour',
  MINUTE = 'minute',
  PORTIONS = 'portion',
  DAYS = 'daysMask',
}

// For UI/features (can include edit/delete etc)
export enum ScheduleFeatureFieldKey {
  TIME = 'time',
  PORTIONS = 'portion',
  DAYS = 'daysMask',
  ENABLE = 'enabled',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
}

// No mapping function needed: use ScheduleEncodingFieldKey directly as property names

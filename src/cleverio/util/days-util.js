// DaysUtil utility for bitmask and label logic
const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
const SHORT_NAMES = {
  'Monday': 'Mon',
  'Tuesday': 'Tue',
  'Wednesday': 'Wed',
  'Thursday': 'Thu',
  'Friday': 'Fri',
  'Saturday': 'Sat',
  'Sunday': 'Sun',
};
function daysArrayToBitmask(days) {
  return days.reduce((mask, day) => mask | getDayBit(day), 0);
}
function bitmaskToDaysArray(mask) {
  return DAYS.filter((day, i) => (mask & (1 << i)) !== 0);
}
function getDayBit(day) {
  return 1 << DAYS.indexOf(day);
}
function getUIDays() {
  // UI order: Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Monday
  return ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
}
function getDaysLabel(mask) {
  if (mask === 0b00011111) return 'Weekdays';
  if (mask === 0b1100000) return 'Weekend';
  if (mask === 0b1111111) return 'Every day';
  const arr = bitmaskToDaysArray(mask);
  if (arr.length === 1) return arr[0];
  if (arr.length === 0) return '';
  return arr.map(d => SHORT_NAMES[d]).join(', ');
}
export default {
  DAYS,
  daysArrayToBitmask,
  bitmaskToDaysArray,
  getDayBit,
  getUIDays,
  getDaysLabel
};

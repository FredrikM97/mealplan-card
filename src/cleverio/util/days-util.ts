// DaysUtil utility for bitmask and label logic (TypeScript)
const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
const SHORT_NAMES: Record<string, string> = {
  'Monday': 'Mon',
  'Tuesday': 'Tue',
  'Wednesday': 'Wed',
  'Thursday': 'Thu',
  'Friday': 'Fri',
  'Saturday': 'Sat',
  'Sunday': 'Sun',
};
export function daysArrayToBitmask(days: string[]): number {
  return days.reduce((mask, day) => mask | getDayBit(day), 0);
}
export function bitmaskToDaysArray(mask: number): string[] {
  return DAYS.filter((day, i) => (mask & (1 << i)) !== 0);
}
export function getDayBit(day: string): number {
  return 1 << DAYS.indexOf(day);
}
export function getUIDays(): string[] {
  // UI order: Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Monday
  return ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
}
export function getDaysLabel(mask: number): string {
  if (mask === 0b00011111) return 'Weekdays';
  if (mask === 0b1100000) return 'Weekend';
  if (mask === 0b1111111) return 'Every day';
  const arr = bitmaskToDaysArray(mask);
  if (arr.length === 1) return arr[0];
  if (arr.length === 0) return '';
  return arr.map(d => SHORT_NAMES[d]).join(', ');
}
export { DAYS };
export default {
  DAYS,
  daysArrayToBitmask,
  bitmaskToDaysArray,
  getDayBit,
  getUIDays,
  getDaysLabel
};

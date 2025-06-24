// Enum for days of the week, using bitmask values directly
export enum Day {
  Monday = 1 << 0,
  Tuesday = 1 << 1,
  Wednesday = 1 << 2,
  Thursday = 1 << 3,
  Friday = 1 << 4,
  Saturday = 1 << 5,
  Sunday = 1 << 6,
}

// Convert a bitmask to an array of Day enums
export function bitmaskToDays(mask: number): Day[] {
  return Object.values(Day)
    .filter((v) => typeof v === 'number')
    .map((v) => v as number)
    .filter((v) => (mask & v) !== 0) as Day[];
}

// Convert an array of Day enums to a bitmask
export function daysToBitmask(days: Day[]): number {
  return days.reduce((mask, day) => mask | day, 0);
}

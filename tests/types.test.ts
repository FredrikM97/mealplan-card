import { describe, expect, it } from 'vitest';
import {
  bitmaskToDays,
  daysToBitmask,
  Day,
  isValidDayBitmask,
} from '../src/types';

describe('days-util bitmask/enum', () => {
  it('daysToBitmask and bitmaskToDays roundtrip', () => {
    const days = [Day.Monday, Day.Wednesday, Day.Friday];
    const mask = daysToBitmask(days);
    expect(bitmaskToDays(mask)).toEqual(days);
  });

  it('bitmaskToDays returns empty for 0', () => {
    expect(bitmaskToDays(0)).toEqual([]);
  });

  it('daysToBitmask returns 0 for empty', () => {
    expect(daysToBitmask([])).toBe(0);
  });

  it('isValidDayBitmask returns true for valid bitmasks', () => {
    expect(isValidDayBitmask(0b0111111)).toBe(true); // All 7 days
    expect(isValidDayBitmask(0b0000001)).toBe(true); // Monday only
    expect(isValidDayBitmask(0)).toBe(true); // No days
  });

  it('isValidDayBitmask returns false for invalid bitmasks', () => {
    expect(isValidDayBitmask(0b10000000)).toBe(false); // Bit 8 set
    expect(isValidDayBitmask(0b11111111)).toBe(false); // Bit 8 set
    expect(isValidDayBitmask(256)).toBe(false); // Way out of range
  });
});

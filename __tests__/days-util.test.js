import DaysUtil from '../www/cleverio-pf100-feeder-card/utils/days-util.js';
import { describe, it, expect } from 'vitest';

describe('DaysUtil', () => {
  it('getDaysLabel returns correct labels', () => {
    expect(DaysUtil.getDaysLabel(0b00011111)).toBe('Weekdays');
    expect(DaysUtil.getDaysLabel(0b1100000)).toBe('Weekend');
    expect(DaysUtil.getDaysLabel(0b1111111)).toBe('Every day');
    expect(DaysUtil.getDaysLabel(0b0000001)).toBe('Monday');
  });

  it('bitmaskToDaysArray and daysArrayToBitmask roundtrip', () => {
    const days = ['Monday', 'Wednesday', 'Friday'];
    const mask = DaysUtil.daysArrayToBitmask(days);
    expect(DaysUtil.bitmaskToDaysArray(mask)).toEqual(days);
  });

  it('bitmaskToDaysArray returns empty for 0', () => {
    expect(DaysUtil.bitmaskToDaysArray(0)).toEqual([]);
  });

  it('getUIDays returns correct UI order', () => {
    expect(DaysUtil.getUIDays()).toEqual([
      'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'
    ]);
  });

  it('getDayBit returns correct bit for each day', () => {
    DaysUtil.DAYS.forEach((day, i) => {
      expect(DaysUtil.getDayBit(day)).toBe(1 << i);
    });
  });

  it('getDaysLabel returns short names for multiple days', () => {
    // Not a group, not a single day
    const mask = DaysUtil.daysArrayToBitmask(['Monday', 'Wednesday', 'Friday']);
    expect(DaysUtil.getDaysLabel(mask)).toBe('Mon, Wed, Fri');
  });

  it('getDaysLabel returns empty string for mask 0', () => {
    expect(DaysUtil.getDaysLabel(0)).toBe('');
  });
});

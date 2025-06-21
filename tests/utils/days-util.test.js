import DaysUtil from '../../src/cleverio/util/days-util.js';
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

describe('DaysUtil bitmask logic', () => {
  it('Monday-Friday selection gives bitmask 31 and label Weekdays', () => {
    const mask = DaysUtil.daysArrayToBitmask(['Monday','Tuesday','Wednesday','Thursday','Friday']);
    expect(mask).toBe(31);
    expect(DaysUtil.getDaysLabel(mask)).toBe('Weekdays');
  });
  it('Saturday-Sunday selection gives bitmask 96 and label Weekend', () => {
    const mask = DaysUtil.daysArrayToBitmask(['Saturday','Sunday']);
    expect(mask).toBe(96);
    expect(DaysUtil.getDaysLabel(mask)).toBe('Weekend');
  });
  it('Monday only gives bitmask 1 and label Monday', () => {
    const mask = DaysUtil.daysArrayToBitmask(['Monday']);
    expect(mask).toBe(1);
    expect(DaysUtil.getDaysLabel(mask)).toBe('Monday');
  });
  it('Monday, Wednesday, Friday gives correct short names', () => {
    const mask = DaysUtil.daysArrayToBitmask(['Monday','Wednesday','Friday']);
    expect(DaysUtil.getDaysLabel(mask)).toBe('Mon, Wed, Fri');
  });
});

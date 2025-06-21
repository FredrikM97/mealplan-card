import DaysUtil from '../src/cleverio/util/days-util.js';
import { describe, it, expect } from 'vitest';

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

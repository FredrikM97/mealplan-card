import { describe, expect, it } from 'vitest';
import {
  validateFeedingTime,
  formatHourMinute,
} from '../../src/components/schedule-view';

describe('formatHourMinute', () => {
  it('formats valid times correctly', () => {
    expect(formatHourMinute(8, 30)).toBe('08:30');
    expect(formatHourMinute(0, 0)).toBe('00:00');
    expect(formatHourMinute(23, 59)).toBe('23:59');
    expect(formatHourMinute(12, 5)).toBe('12:05');
  });

  it('returns --:-- for invalid inputs', () => {
    expect(formatHourMinute(24, 0)).toBe('--:--');
    expect(formatHourMinute(-1, 0)).toBe('--:--');
    expect(formatHourMinute(8, 60)).toBe('--:--');
    expect(formatHourMinute(8, -1)).toBe('--:--');
    expect(formatHourMinute(NaN, 0)).toBe('--:--');
    expect(formatHourMinute(8, NaN)).toBe('--:--');
    expect(formatHourMinute(undefined, 0)).toBe('--:--');
    expect(formatHourMinute(8, undefined)).toBe('--:--');
  });
});

describe('validateFeedingTime', () => {
  it('returns error for invalid hour/minute', () => {
    expect(validateFeedingTime({ hour: -1, minute: 0, portion: 1 })).toBe(
      'Please enter a valid time.',
    );
    expect(validateFeedingTime({ hour: 8, minute: 60, portion: 1 })).toBe(
      'Please enter a valid time.',
    );
    expect(validateFeedingTime({ hour: NaN, minute: 0, portion: 1 })).toBe(
      'Please enter a valid time.',
    );
    expect(validateFeedingTime({ hour: 24, minute: 0, portion: 1 })).toBe(
      'Please enter a valid time.',
    );
    expect(validateFeedingTime({ hour: 8, minute: -1, portion: 1 })).toBe(
      'Please enter a valid time.',
    );
  });

  it('returns error for missing/invalid portion', () => {
    expect(validateFeedingTime({ hour: 8, minute: 0, portion: 0 })).toBe(
      'Portion must be at least 1.',
    );
    expect(validateFeedingTime({ hour: 8, minute: 0 })).toBe(
      'Portion must be at least 1.',
    );
  });

  it('returns null for valid input', () => {
    expect(validateFeedingTime({ hour: 8, minute: 0, portion: 1 })).toBeNull();
    expect(validateFeedingTime({ hour: 0, minute: 0, portion: 10 })).toBeNull();
    expect(
      validateFeedingTime({ hour: 23, minute: 59, portion: 5 }),
    ).toBeNull();
  });
});

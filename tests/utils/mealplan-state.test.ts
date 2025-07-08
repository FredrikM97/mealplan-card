// Migrated to TypeScript
import { describe, expect, it } from 'vitest';
import {
  getNextSchedule,
  getTotalFoodPerDay,
  getTodaysFoodGrams,
  encodeMealPlanData,
  decodeMealPlanData,
  FeedingTime,
  validateFeedingTime,
  formatHourMinute
} from '../../src/util/mealplan-state';
import { cleverioProfile } from '../../src/profiles/cleverio';

describe('Mealplan State', () => {
  it('getNextSchedule returns "-" if no enabled times', () => {
    expect(getNextSchedule([])).toBe('-');
  });

  it('decodeMealPlanData returns [] for base64String unknown', () => {
    const result = decodeMealPlanData('unknown', { encodingFields: ["hour", "minute", "portion", "enabled"] });
    expect(result).toEqual([]);
  });

  it('decodeMealPlanData sanitizes missing fields', () => {
    // Only 2 fields encoded, but 4 expected
    const encoded = encodeMealPlanData([
      { hour: 8, minute: 0, portion: 2, enabled: 1 }
    ], { encodingFields: ["hour", "minute", "portion", "enabled"] });
    // Remove last byte to simulate missing field
    const partial = encoded.slice(0, -2);
    expect(() => decodeMealPlanData(partial, { encodingFields: ["hour", "minute", "portion", "enabled"] })).toThrow('Invalid meal plan length');
  });

  it('encodeMealPlanData returns empty string for empty feedingTimes', () => {
    const encoded = encodeMealPlanData([], { encodingFields: ["hour", "minute", "portion", "enabled"] });
    expect(encoded).toBe("");
  });

  it('getNextSchedule returns correct for only one enabled time at 0:00', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 0, minute: 0, portion: 1, enabled: 1 }
    ];
    expect(getNextSchedule(feedingTimes)).toBe('00:00');
  });

  it('getNextSchedule returns correct for only one enabled time at 23:59', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 23, minute: 59, portion: 1, enabled: 1 }
    ];
    expect(getNextSchedule(feedingTimes)).toBe('23:59');
  });

  it('getTotalFoodPerDay skips entries with missing daysMask', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 2, enabled: 1 }, // missing daysMask
      { hour: 9, minute: 0, portion: 1, enabled: 1, daysMask: 0b0000001 }
    ];
    const totals = getTotalFoodPerDay(feedingTimes);
    expect(totals[0]).toBe(0); // Monday
    expect(totals[6]).toBe(1); // Sunday
  });

  it('getTodaysFoodGrams skips entries with missing daysMask', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 2, enabled: 1 }, // missing daysMask
      { hour: 9, minute: 0, portion: 1, enabled: 1, daysMask: 0b0000001 }
    ];
    expect(getTodaysFoodGrams(feedingTimes, 6)).toBe(1); // Sunday
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });

  it('getTotalFoodPerDay returns correct totals', () => {
    const feedingTimes: import('../../src/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, daysMask: 0b1000001, portion: 1, enabled: 1 },
    ];
    const totals = getTotalFoodPerDay(feedingTimes);
    // 0=Monday, 1=Tuesday, ..., 6=Sunday
    expect(totals[0]).toBe(1); // Monday
    expect(totals[1]).toBe(2); // Tuesday
    expect(totals[5]).toBe(2); // Saturday (bitmask includes Saturday)
    expect(totals[6]).toBe(1); // Sunday
  });

  it('getTotalFoodPerDay returns all zeros for empty input', () => {
    const totals = getTotalFoodPerDay([]);
    expect(Object.values(totals).every(v => v === 0)).toBe(true);
  });

  it('getTotalFoodPerDay ignores disabled times', () => {
    const feedingTimes: import('../../src/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b1111111, portion: 2, enabled: 0 },
    ];
    const totals = getTotalFoodPerDay(feedingTimes);
    expect(Object.values(totals).every(v => v === 0)).toBe(true);
  });

  it('getTodaysFoodGrams returns correct grams for today', () => {
    const feedingTimes: import('../../src/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, daysMask: 0b1000001, portion: 1, enabled: 1 },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(1); // Monday
    expect(getTodaysFoodGrams(feedingTimes, 1)).toBe(2); // Tuesday
    expect(getTodaysFoodGrams(feedingTimes, 6)).toBe(1); // Sunday
  });

  it('getNextSchedule returns first enabled time', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 7, minute: 0, daysMask: 0b1111111, portion: 1, enabled: 0 },
      { hour: 9, minute: 0, daysMask: 0b1111111, portion: 1, enabled: 1 },
      { hour: 12, minute: 0, daysMask: 0b1111111, portion: 1, enabled: 1 },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('09:00');
  });

  it('getTodaysFoodGrams returns 0 if no enabled times for today', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b0000000, portion: 2, enabled: 1 },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });

  it('getTodaysFoodGrams ignores disabled times', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b1111111, portion: 2, enabled: 0 },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });


  // Only keep a generic round-trip test for encode/decode
  it('encodeMealPlanData and decodeMealPlanData are inverses for generic data', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, daysMask: 0b1000001, portion: 1, enabled: 0 },
    ];
    const encoded = encodeMealPlanData(feedingTimes, { encodingFields: ["daysMask", "hour", "minute", "portion", "enabled"] });
    const decoded = decodeMealPlanData(encoded, { encodingFields: ["daysMask", "hour", "minute", "portion", "enabled"] });
    expect(decoded).toEqual(feedingTimes);
  });

  // Removed layout-string-based tests; use device profiles only

  // Removed layout-string-based tests; use device profiles only
});

describe('validateFeedingTime', () => {
  it('returns error for invalid hour/minute', () => {
    expect(
      validateFeedingTime({ hour: -1, minute: 0, portion: 1 })
    ).toBe('Please enter a valid time.');
    expect(
      validateFeedingTime({ hour: 8, minute: 60, portion: 1 })
    ).toBe('Please enter a valid time.');
    expect(
      validateFeedingTime({ hour: NaN, minute: 0, portion: 1 })
    ).toBe('Please enter a valid time.');
  });
  it('returns error for missing/invalid portion', () => {
    expect(
      validateFeedingTime({ hour: 8, minute: 0, portion: 0 })
    ).toBe('Portion must be at least 1.');
    expect(
      validateFeedingTime({ hour: 8, minute: 0 })
    ).toBe('Portion must be at least 1.');
  });
  it('returns null for valid input', () => {
    expect(
      validateFeedingTime({ hour: 8, minute: 0, portion: 1 })
    ).toBeNull();
  });
});

describe('decodeMealPlanData/encodeMealPlanData error handling', () => {
  const { decodeMealPlanData, encodeMealPlanData } = require('../../src/util/mealplan-state');
  it('throws on invalid base64', () => {
    expect(() => decodeMealPlanData('!@#$', { encodingFields: ["hour"] })).toThrow('Invalid base64');
  });
  it('throws on invalid profile', () => {
    expect(() => decodeMealPlanData('AA==', { encodingFields: undefined })).toThrow('Invalid device profile for decoding');
    expect(() => encodeMealPlanData([], { encodingFields: undefined })).toThrow('Invalid device profile for encoding');
  });
  it('throws on invalid meal plan length', () => {
    // 2 bytes, but 3 fields expected
    expect(() => decodeMealPlanData('AAA=', { encodingFields: ["hour", "minute", "portion"] })).toThrow('Invalid meal plan length');
  });
  it('throws on missing field in encode', () => {
    expect(() => encodeMealPlanData([{ hour: 8, minute: 0 }], { encodingFields: ["hour", "minute", "portion"] })).toThrow();
  });
});

describe('formatHourMinute', () => {
  const { formatHourMinute } = require('../../src/util/mealplan-state');
  it('formats valid hour/minute', () => {
    expect(formatHourMinute(8, 5)).toBe('08:05');
    expect(formatHourMinute(23, 59)).toBe('23:59');
  });
  it('returns --:-- for invalid input', () => {
    expect(formatHourMinute(undefined, 0)).toBe('--:--');
    expect(formatHourMinute(8, undefined)).toBe('--:--');
    expect(formatHourMinute(NaN, 0)).toBe('--:--');
    expect(formatHourMinute(-1, 0)).toBe('--:--');
    expect(formatHourMinute(8, 60)).toBe('--:--');
  });
});

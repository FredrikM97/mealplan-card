// Migrated to TypeScript
import { describe, expect, it } from 'vitest';
import {
  getNextSchedule,
  getTotalFoodPerDay,
  getTodaysFoodGrams,
  encodeMealPlanData,
  decodeMealPlanData
} from '../../src/cleverio/util/mealplan-state';

describe('Mealplan State', () => {
  it('getNextSchedule returns "-" if no enabled times', () => {
    expect(getNextSchedule([])).toBe('-');
  });

  it('getTotalFoodPerDay returns correct totals', () => {
    const feedingTimes: import('../../src/cleverio/util/mealplan-state').FeedingTime[] = [
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
    const feedingTimes: import('../../src/cleverio/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b1111111, portion: 2, enabled: 0 },
    ];
    const totals = getTotalFoodPerDay(feedingTimes);
    expect(Object.values(totals).every(v => v === 0)).toBe(true);
  });

  it('getTodaysFoodGrams returns correct grams for today', () => {
    const feedingTimes: import('../../src/cleverio/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, daysMask: 0b1000001, portion: 1, enabled: 1 },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(1); // Monday
    expect(getTodaysFoodGrams(feedingTimes, 1)).toBe(2); // Tuesday
    expect(getTodaysFoodGrams(feedingTimes, 6)).toBe(1); // Sunday
  });

  it('getNextSchedule returns first enabled time', () => {
    const feedingTimes: import('../../src/cleverio/util/mealplan-state').FeedingTime[] = [
      { hour: 7, minute: 0, daysMask: 0b1111111, portion: 1, enabled: 0 },
      { hour: 9, minute: 0, daysMask: 0b1111111, portion: 1, enabled: 1 },
      { hour: 12, minute: 0, daysMask: 0b1111111, portion: 1, enabled: 1 },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('09:00');
  });

  it('getTodaysFoodGrams returns 0 if no enabled times for today', () => {
    const feedingTimes: import('../../src/cleverio/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b0000000, portion: 2, enabled: 1 },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });

  it('getTodaysFoodGrams ignores disabled times', () => {
    const feedingTimes: import('../../src/cleverio/util/mealplan-state').FeedingTime[] = [
      { hour: 8, minute: 0, daysMask: 0b1111111, portion: 2, enabled: 0 },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });

  it('encodeMealPlanData and decodeMealPlanData are inverses', () => {
    const feedingTimes = [
      { hour: 8, minute: 0, daysMask: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, daysMask: 0b1000001, portion: 1, enabled: 0 },
    ];
    const encoded = encodeMealPlanData(feedingTimes, 'tuya_with_daysMask');
    const decoded = decodeMealPlanData(encoded, 'tuya_with_daysMask');
    expect(decoded[0].hour).toBe(8);
    expect(decoded[0].minute).toBe(0);
    expect(decoded[0].portion).toBe(2);
    expect(decoded[0].enabled).toBe(1);
    expect(decoded[1].enabled).toBe(0);
  });

  it('decodeMealPlanData throws on invalid base64', () => {
    expect(() => decodeMealPlanData('!@#$', 'tuya_with_daysMask')).toThrow('Invalid base64');
  });



  it('decodeMealPlanData decodes real device base64 and encodeMealPlanData re-encodes it correctly', () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const expected = [
      { hour: 4, minute: 0, daysMask: 127, portion: 1, enabled: 0 },
      { hour: 9, minute: 0, daysMask: 127, portion: 2, enabled: 1 },
      { hour: 15, minute: 0, daysMask: 127, portion: 1, enabled: 1 },
      { hour: 21, minute: 0, daysMask: 127, portion: 2, enabled: 1 },
      { hour: 18, minute: 0, daysMask: 8, portion: 1, enabled: 0 }
    ];
    const decoded = decodeMealPlanData(base64, 'tuya_with_daysMask');
    expect(decoded).toEqual(expected);
    // Re-encode and decode again to check round-trip
    const reEncoded = encodeMealPlanData(decoded, 'tuya_with_daysMask');
    const roundTrip = decodeMealPlanData(reEncoded, 'tuya_with_daysMask');
    expect(roundTrip).toEqual(expected);
  });

  describe('decodeMealPlanData (layout-driven)', () => {
    it('decodes tuya_with_daysMask base64', () => {
      // daysMask=127, hour=8, minute=30, portion=2, enabled=1
      const base64 = btoa(String.fromCharCode(127, 8, 30, 2, 1));
      const result = decodeMealPlanData(base64, 'tuya_with_daysMask');
      expect(result).toEqual([
        {
          daysMask: 127,
          hour: 8,
          minute: 30,
          portion: 2,
          enabled: 1
        }
      ]);
    });

    it('decodes tuya_no_daysMask base64', () => {
      // hour=7, minute=15, portion=3, enabled=0
      const base64 = btoa(String.fromCharCode(7, 15, 3, 0));
      const result = decodeMealPlanData(base64, 'tuya_no_daysMask');
      expect(result).toEqual([
        {
          hour: 7,
          minute: 15,
          portion: 3,
          enabled: 0
        }
      ]);
    });
  });

  describe('decodeMealPlanData (real base64 samples)', () => {
    it('decodes DAABAQweAgENAAQBDR4DAQ4ABAEOHgYB as tuya_no_daysMask', () => {
      const base64 = 'DAABAQweAgENAAQBDR4DAQ4ABAEOHgYB';
      const result = decodeMealPlanData(base64, 'tuya_no_daysMask');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      // Optionally, check the first entry structure
      expect(result[0]).toHaveProperty('hour');
      expect(result[0]).toHaveProperty('minute');
      expect(result[0]).toHaveProperty('portion');
      expect(result[0]).toHaveProperty('enabled');
    });

    it('decodes fwQAAQF/CQACAX8PAAEBfxUAAgEIEgABAQ== as tuya_with_daysMask', () => {
      const base64 = 'fwQAAQF/CQACAX8PAAEBfxUAAgEIEgABAQ==';
      const result = decodeMealPlanData(base64, 'tuya_with_daysMask');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('daysMask');
      expect(result[0]).toHaveProperty('hour');
      expect(result[0]).toHaveProperty('minute');
      expect(result[0]).toHaveProperty('portion');
      expect(result[0]).toHaveProperty('enabled');
    });
  });
});

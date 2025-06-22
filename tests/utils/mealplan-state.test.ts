// Migrated to TypeScript
import { describe, expect, it } from 'vitest';
import {
  getNextSchedule,
  getTotalFoodPerDay,
  getTodaysFoodGrams,
  encodeMealPlanData,
  decodeMealPlanData,
  parseFeedingTime,
  formatFeedingTime
} from '../../src/cleverio/util/mealplan-state';

describe('Mealplan State', () => {
  it('getNextSchedule returns "-" if no enabled times', () => {
    expect(getNextSchedule([])).toBe('-');
  });

  it('getTotalFoodPerDay returns correct totals', () => {
    const feedingTimes = [
      { time: '08:00', daysMask: 0b0111110, portion: 2, enabled: true },
      { time: '10:00', daysMask: 0b1000001, portion: 1, enabled: true },
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
    const feedingTimes = [
      { time: '08:00', daysMask: 0b1111111, portion: 2, enabled: false },
    ];
    const totals = getTotalFoodPerDay(feedingTimes);
    expect(Object.values(totals).every(v => v === 0)).toBe(true);
  });

  it('getTodaysFoodGrams returns correct grams for today', () => {
    const feedingTimes = [
      { time: '08:00', daysMask: 0b0111110, portion: 2, enabled: true },
      { time: '10:00', daysMask: 0b1000001, portion: 1, enabled: true },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(1); // Monday
    expect(getTodaysFoodGrams(feedingTimes, 1)).toBe(2); // Tuesday
    expect(getTodaysFoodGrams(feedingTimes, 6)).toBe(1); // Sunday
  });

  it('getNextSchedule returns first enabled time', () => {
    const feedingTimes = [
      { time: '07:00', daysMask: 0b1111111, portion: 1, enabled: false },
      { time: '09:00', daysMask: 0b1111111, portion: 1, enabled: true },
      { time: '12:00', daysMask: 0b1111111, portion: 1, enabled: true },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('09:00');
  });

  it('getTodaysFoodGrams returns 0 if no enabled times for today', () => {
    const feedingTimes = [
      { time: '08:00', daysMask: 0b0000000, portion: 2, enabled: true },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });

  it('getTodaysFoodGrams ignores disabled times', () => {
    const feedingTimes = [
      { time: '08:00', daysMask: 0b1111111, portion: 2, enabled: false },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 0)).toBe(0); // Monday
  });

  it('encodeMealPlanData and decodeMealPlanData are inverses', () => {
    const feedingTimes = [
      { time: '08:00', daysMask: 0b0111110, portion: 2, enabled: true },
      { time: '10:00', daysMask: 0b1000001, portion: 1, enabled: false },
    ];
    const encoded = encodeMealPlanData(feedingTimes);
    const decoded = decodeMealPlanData(encoded);
    expect(decoded[0].time).toBe('08:00');
    expect(decoded[0].portion).toBe(2);
    expect(decoded[0].enabled).toBe(true);
    expect(decoded[1].enabled).toBe(false);
  });

  it('decodeMealPlanData throws on invalid base64', () => {
    expect(() => decodeMealPlanData('!@#$')).toThrow('Invalid base64');
  });

  it('parseFeedingTime and formatFeedingTime work as inverses', () => {
    const str = '08:00,2,Monday,Tuesday';
    const obj = parseFeedingTime(str);
    expect(obj.time).toBe('08:00');
    expect(obj.portion).toBe(2);
    expect(obj.days).toEqual(['Monday','Tuesday']);
    expect(formatFeedingTime(obj)).toBe(str);
  });

  it('decodeMealPlanData decodes real device base64 and encodeMealPlanData re-encodes it correctly', () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const expected = [
      { time: '04:00', daysMask: 127, portion: 1, enabled: false },
      { time: '09:00', daysMask: 127, portion: 2, enabled: true },
      { time: '15:00', daysMask: 127, portion: 1, enabled: true },
      { time: '21:00', daysMask: 127, portion: 2, enabled: true },
      { time: '18:00', daysMask: 8, portion: 1, enabled: false }
    ];
    const decoded = decodeMealPlanData(base64);
    expect(decoded).toEqual(expected);
    // Re-encode and decode again to check round-trip
    const reEncoded = encodeMealPlanData(decoded);
    const roundTrip = decodeMealPlanData(reEncoded);
    expect(roundTrip).toEqual(expected);
  });
});

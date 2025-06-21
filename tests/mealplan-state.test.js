import { getNextSchedule, getTotalFoodPerDay, getTodaysFoodGrams, encodeMealPlanData, decodeMealPlanData, encodeMealPlan, decodeMealPlan, parseFeedingTime, formatFeedingTime } from '../src/cleverio/util/mealplan-state.js';
import { describe, it, expect } from 'vitest';

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
    expect(totals['Monday']).toBe(1);
    expect(totals['Tuesday']).toBe(2);
    expect(totals['Saturday']).toBe(2); // fixed: should be 2
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
    expect(getTodaysFoodGrams(feedingTimes, 'Monday')).toBe(1);
    expect(getTodaysFoodGrams(feedingTimes, 'Tuesday')).toBe(2);
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
    expect(getTodaysFoodGrams(feedingTimes, 'Monday')).toBe(0);
  });

  it('getTodaysFoodGrams ignores disabled times', () => {
    const feedingTimes = [
      { time: '08:00', daysMask: 0b1111111, portion: 2, enabled: false },
    ];
    expect(getTodaysFoodGrams(feedingTimes, 'Monday')).toBe(0);
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

  it('encodeMealPlan and decodeMealPlan are inverses', () => {
    const feedingTimes = [
      { time: '12:00', daysMask: 0b1111111, portion: 3, enabled: true }
    ];
    const encoded = encodeMealPlan(feedingTimes);
    const decoded = decodeMealPlan(encoded);
    expect(decoded[0].time).toBe('12:00');
    expect(decoded[0].portion).toBe(3);
    expect(decoded[0].enabled).toBe(true);
  });

  it('decodeMealPlanData throws on invalid base64', () => {
    expect(() => decodeMealPlanData('!@#$')).toThrow('Invalid base64');
  });

  it('decodeMealPlan throws on invalid meal plan length', () => {
    // base64 for 4 bytes (should be multiple of 5)
    const bad = btoa(String.fromCharCode(1,2,3,4));
    expect(() => decodeMealPlan(bad)).toThrow('Invalid meal plan length');
  });

  it('parseFeedingTime and formatFeedingTime work as inverses', () => {
    const str = '08:00,2,Monday,Tuesday';
    const obj = parseFeedingTime(str);
    expect(obj.time).toBe('08:00');
    expect(obj.portion).toBe(2);
    expect(obj.days).toEqual(['Monday','Tuesday']);
    expect(formatFeedingTime(obj)).toBe(str);
  });
});

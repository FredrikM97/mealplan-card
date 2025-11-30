import { describe, expect, it } from 'vitest';
import {
  getNextSchedule,
  getTotalFoodPerDay,
  getTodaysFoodGrams,
} from '../../src/util/metrics';
import type { FeedingTime } from '../../src/util/serializer';

describe('Overview statistics', () => {
  it('getNextSchedule returns "-" if no enabled times', () => {
    expect(getNextSchedule([])).toBe('-');
  });

  it('getNextSchedule returns correct for only one enabled time at 0:00', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 0, minute: 0, portion: 1, enabled: 1 },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('00:00');
  });

  it('getNextSchedule returns correct for only one enabled time at 23:59', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 23, minute: 59, portion: 1, enabled: 1 },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('23:59');
  });

  it('getTotalFoodPerDay throws if any entry is missing daysMask', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 2, enabled: 1 },
      { hour: 9, minute: 0, portion: 1, enabled: 1, days: 0b0000001 },
    ];
    expect(() => {
      const totals = getTotalFoodPerDay(feedingTimes);
      expect(totals[0]).toBe(1);
      expect(totals.slice(1).every((v) => v === 0)).toBe(true);
    }).not.toThrow();
  });
  it('getTodaysFoodGrams throws if any entry is missing daysMask', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 2, enabled: 1 },
      { hour: 9, minute: 0, portion: 1, enabled: 1, days: 0b0000001 },
    ];
    expect(() => {
      const total = getTodaysFoodGrams(feedingTimes, 0);
      expect(total).toBe(1);
    }).not.toThrow();
  });

  it('getTotalFoodPerDay returns correct totals', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, days: 0b1000001, portion: 1, enabled: 1 },
    ];
    const profile = {
      encodingTemplate: '{DAYS:h2}{HOUR:h2}{MINUTE:h2}{PORTION:h2}{ENABLED:h2}',
    };
    const totals = getTotalFoodPerDay(feedingTimes, profile);
    expect(totals[0]).toBe(1);
    expect(totals[1]).toBe(2);
    expect(totals[5]).toBe(2);
    expect(totals[6]).toBe(1);
  });

  it('getTotalFoodPerDay ignores disabled times if profile has enabled', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b1111111, portion: 2, enabled: 0 },
    ];
    const profile = {
      encodingTemplate: '{DAYS:h2}{HOUR:h2}{MINUTE:h2}{PORTION:h2}{ENABLED:h2}',
    };
    const totals = getTotalFoodPerDay(feedingTimes, profile);
    expect(Object.values(totals).every((v) => v === 0)).toBe(true);
  });

  it('getTotalFoodPerDay does not ignore if profile does not have enabled', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b1111111, portion: 2, enabled: 0 },
    ];
    const profile = {
      encodingTemplate: '{DAYS:h2}{HOUR:h2}{MINUTE:h2}{PORTION:h2}',
    };
    const totals = getTotalFoodPerDay(feedingTimes, profile);
    expect(totals).toEqual([2, 2, 2, 2, 2, 2, 2]);
  });

  it('getNextSchedule handles feedingTimes without enabled field', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 12, minute: 30, portion: 1 },
      { hour: 8, minute: 15, portion: 2 },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('08:15');
  });

  it('getNextSchedule returns - when no enabled times with enabled field', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 1, enabled: 0 },
      { hour: 9, minute: 0, portion: 1, enabled: 0 },
    ];
    expect(getNextSchedule(feedingTimes)).toBe('-');
  });

  it('getTotalFoodPerDay handles missing portion field gracefully', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b0000001, enabled: 1 } as any,
    ];
    const profile = {
      encodingTemplate: '{DAYS:h2}{HOUR:h2}{MINUTE:h2}{PORTION:h2}{ENABLED:h2}',
    };
    const totals = getTotalFoodPerDay(feedingTimes, profile);
    expect(totals).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('getTodaysFoodGrams handles missing portion field gracefully', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b0000001, enabled: 1 } as any,
    ];
    const profile = {
      encodingTemplate: '{DAYS:h2}{HOUR:h2}{MINUTE:h2}{PORTION:h2}{ENABLED:h2}',
    };
    const total = getTodaysFoodGrams(feedingTimes, 0, profile);
    expect(total).toBe(0);
  });
});

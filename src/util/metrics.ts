import { T } from 'vitest/dist/chunks/reporters.d.BFLkQcL6';
import { FeedingTime } from './serializer';
import { formatHourMinute } from './days-util';

export function getNextSchedule(feedingTimes: FeedingTime[]): string {
  if (!feedingTimes || feedingTimes.length === 0) return '-';
  if (feedingTimes.some((t) => t.enabled === undefined)) {
    const sorted = [...feedingTimes].sort((a, b) =>
      (a.hour ?? 0) !== (b.hour ?? 0)
        ? (a.hour ?? 0) - (b.hour ?? 0)
        : (a.minute ?? 0) - (b.minute ?? 0),
    );
    return sorted.length
      ? formatHourMinute(sorted[0].hour ?? 0, sorted[0].minute ?? 0)
      : '-';
  }
  const enabled = feedingTimes.filter((t) => t.enabled === 1);
  if (enabled.length === 0) return '-';
  enabled.sort((a, b) =>
    (a.hour ?? 0) !== (b.hour ?? 0)
      ? (a.hour ?? 0) - (b.hour ?? 0)
      : (a.minute ?? 0) - (b.minute ?? 0),
  );
  return formatHourMinute(enabled[0].hour ?? 0, enabled[0].minute ?? 0);
}

export function getTotalFoodPerDay(
  feedingTimes: FeedingTime[],
  profile?: { encodingTemplate?: string },
): number[] {
  const totals = Array(7).fill(0);
  const hasEnabled = profile?.encodingTemplate?.includes('ENABLED');
  const relevant = hasEnabled
    ? feedingTimes.filter((t) => t.enabled === 1)
    : feedingTimes;
  relevant.forEach((t, idx) => {
    if (typeof t.days !== 'number') {
      console.error(
        `FeedingTime entry #${idx} is missing required 'days' field.`,
      );
      return;
    }
    if (typeof t.portion !== 'number') {
      console.error(
        `FeedingTime entry #${idx} is missing required 'portion' field.`,
      );
      return;
    }
    for (let i = 0; i < 7; i++) {
      if (t.days & (1 << i)) {
        totals[i] += t.portion;
      }
    }
  });
  return totals;
}

export function getTodaysFoodGrams(
  feedingTimes: FeedingTime[],
  dayIdx: number,
  profile?: { encodingTemplate?: string },
): number {
  let total = 0;
  const hasEnabled = profile?.encodingTemplate?.includes('ENABLED');
  const relevant = hasEnabled
    ? feedingTimes.filter((t) => t.enabled === 1)
    : feedingTimes;
  relevant.forEach((t, idx) => {
    if (typeof t.days !== 'number') {
      console.error(
        `FeedingTime entry #${idx} is missing required 'days' field.`,
      );
      return;
    }
    if (typeof t.portion !== 'number') {
      console.error(
        `FeedingTime entry #${idx} is missing required 'portion' field.`,
      );
      return;
    }
    if (t.days & (1 << dayIdx)) {
      total += t.portion;
    }
  });
  return total;
}

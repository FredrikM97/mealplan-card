// Mealplan state utilities (TypeScript)
export interface FeedingTime {
  time: string;
  portion: number;
  daysMask: number;
  enabled: boolean;
}
export function getNextSchedule(feedingTimes: FeedingTime[]): string {
  if (!feedingTimes || feedingTimes.length === 0) return '-';
  const enabled = feedingTimes.filter(t => t.enabled);
  if (enabled.length === 0) return '-';
  enabled.sort((a, b) => a.time.localeCompare(b.time));
  return enabled[0].time;
}
export function getTotalFoodPerDay(feedingTimes: FeedingTime[]): Record<string, number> {
  const totals: Record<string, number> = {
    'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0
  };
  feedingTimes.forEach(t => {
    if (!t.enabled) return;
    for (let i = 0; i < 7; i++) {
      if (t.daysMask & (1 << i)) {
        const day = [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ][i];
        totals[day] += t.portion;
      }
    }
  });
  return totals;
}
export function getTodaysFoodGrams(feedingTimes: FeedingTime[], today: string): number {
  let total = 0;
  feedingTimes.forEach(t => {
    if (!t.enabled) return;
    if (t.daysMask & (1 << [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ].indexOf(today))) {
      total += t.portion;
    }
  });
  return total;
}
export function encodeMealPlanData(feedingTimes: FeedingTime[]): string {
  // Each entry: time (4 chars, e.g. 08:00), portion (1 byte), daysMask (1 byte), enabled (1 byte)
  const arr = feedingTimes.map(t => `${t.time},${t.portion},${t.daysMask},${t.enabled ? 1 : 0}`).join(';');
  return btoa(arr);
}
export function decodeMealPlanData(str: string): FeedingTime[] {
  try {
    const arr = atob(str).split(';').filter(Boolean);
    return arr.map(row => {
      const [time, portion, daysMask, enabled] = row.split(',');
      return {
        time,
        portion: Number(portion),
        daysMask: Number(daysMask),
        enabled: enabled === '1'
      };
    });
  } catch (e) {
    throw new Error('Invalid base64');
  }
}
export function encodeMealPlan(feedingTimes: FeedingTime[]): string {
  // For legacy: encode as base64 of JSON
  return btoa(JSON.stringify(feedingTimes));
}
export function decodeMealPlan(str: string): FeedingTime[] {
  try {
    return JSON.parse(atob(str));
  } catch (e) {
    throw new Error('Invalid base64');
  }
}
export function mealsEqual(a: FeedingTime[], b: FeedingTime[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].time !== b[i].time || a[i].portion !== b[i].portion || a[i].daysMask !== b[i].daysMask || a[i].enabled !== b[i].enabled) {
      return false;
    }
  }
  return true;
}
export function parseFeedingTime(str: string): { time: string; portion: number; days: string[] } {
  // Expects format: '08:00,2,Monday,Tuesday'
  const [time, portion, ...days] = str.split(',');
  return {
    time,
    portion: Number(portion),
    days
  };
}
export function formatFeedingTime(obj: { time: string; portion: number; days: string[] }): string {
  // Returns format: '08:00,2,Monday,Tuesday'
  return [obj.time, obj.portion, ...obj.days].join(',');
}

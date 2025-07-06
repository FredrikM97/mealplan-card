
import { getLayoutByName } from './mealplan-layouts';

export interface FeedingTime {
  hour: number;
  minute: number;
  portion: number;
  daysMask?: number;
  enabled: 0 | 1;
}

export function getNextSchedule(feedingTimes: FeedingTime[]): string {
  if (!feedingTimes || feedingTimes.length === 0) return '-';
  const enabled = feedingTimes.filter(t => t.enabled === 1);
  if (enabled.length === 0) return '-';
  enabled.sort((a, b) => {
    if (a.hour !== b.hour) return a.hour - b.hour;
    return a.minute - b.minute;
  });
  return formatHourMinute(enabled[0].hour, enabled[0].minute);
}

// Returns an array of total food per day, index 0=Monday, 6=Sunday
export function getTotalFoodPerDay(feedingTimes: FeedingTime[]): number[] {
  const totals = Array(7).fill(0);
  feedingTimes.forEach(t => {
    if (t.enabled !== 1) return;
    if (typeof t.daysMask !== 'number') return;
    for (let i = 0; i < 7; i++) {
      if (t.daysMask & (1 << i)) {
        totals[i] += t.portion;
      }
    }
  });
  return totals;
}

// Returns total food for a given day index (0=Monday, 6=Sunday)
export function getTodaysFoodGrams(feedingTimes: FeedingTime[], dayIdx: number): number {
  let total = 0;
  feedingTimes.forEach(t => {
    if (t.enabled !== 1) return;
    if (typeof t.daysMask !== 'number') return;
    if (t.daysMask & (1 << dayIdx)) {
      total += t.portion;
    }
  });
  return total;
}



export function decodeMealPlanData(base64String: string, layoutName?: string): FeedingTime[] {
  if (!base64String || base64String === 'unknown') return [];
  if (!layoutName) throw new Error(`Unknown meal plan layout: '${layoutName}'`);
  const layout = getLayoutByName(layoutName);
  if (!layout) throw new Error(`Unknown meal plan layout: '${layoutName}'`);
  let binary: string;
  try {
    binary = atob(base64String);
  } catch {
    throw new Error('Invalid base64');
  }
  const { entrySize, fields } = layout;
  const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
  if (bytes.length % entrySize !== 0) throw new Error('Invalid meal plan length');
  return Array.from({ length: bytes.length / entrySize }, (_, i) => {
    const entry: any = {};
    for (let j = 0; j < fields.length; j++) {
      entry[fields[j] as string] = bytes[i * entrySize + j];
    }
    return entry;
  });
}

export function encodeMealPlanData(feedingTimes: FeedingTime[], layoutName?: string): string {
  if (!layoutName) throw new Error(`Unknown meal plan layout: '${layoutName}'`);
  const layout = getLayoutByName(layoutName);
  if (!layout) throw new Error(`Unknown meal plan layout: '${layoutName}'`);
  const { fields } = layout;
  const bytes: number[] = [];
  feedingTimes.forEach(item => {
    for (const field of fields) {
      bytes.push(Number((item as any)[field as string]) || 0);
    }
  });
  return btoa(String.fromCharCode(...bytes));
}

// Utility for UI formatting only
export function formatHourMinute(hour?: number, minute?: number): string {
  if (typeof hour !== 'number' || isNaN(hour) || typeof minute !== 'number' || isNaN(minute)) return '--:--';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
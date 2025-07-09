import { ScheduleEncodingFieldKey } from '../schedule-schema/fields';

// Returns null if valid, or an error string if invalid
export function validateFeedingTime(entry: Partial<FeedingTime>): string | null {
  if (
    typeof entry.hour !== 'number' ||
    typeof entry.minute !== 'number' ||
    isNaN(entry.hour) ||
    isNaN(entry.minute) ||
    entry.hour < 0 || entry.hour > 23 ||
    entry.minute < 0 || entry.minute > 59
  ) {
    return 'Please enter a valid time.';
  }
  if (!entry.portion || entry.portion < 1) {
    return 'Portion must be at least 1.';
  }
  return null;
}



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


export function getTotalFoodPerDay(feedingTimes: FeedingTime[]): number[] {

  const totals = Array(7).fill(0);
  feedingTimes.forEach((t, idx) => {
    if (t.enabled !== 1) return;
    if (typeof t.daysMask !== 'number') {
      console.error(`FeedingTime entry #${idx} is missing required 'daysMask' field.`);
      return;
    }
    if (typeof t.portion !== 'number') {
      console.error(`FeedingTime entry #${idx} is missing required 'portion' field.`);
      return;
    }
    for (let i = 0; i < 7; i++) {
      if (t.daysMask & (1 << i)) {
        totals[i] += t.portion;
      }
    }
  });
  return totals;
}

export function getTodaysFoodGrams(feedingTimes: FeedingTime[], dayIdx: number): number {
  let total = 0;
  feedingTimes.forEach((t, idx) => {
    if (t.enabled !== 1) return;
    if (typeof t.daysMask !== 'number') {
      console.error(`FeedingTime entry #${idx} is missing required 'daysMask' field.`);
      return;
    }
    if (typeof t.portion !== 'number') {
      console.error(`FeedingTime entry #${idx} is missing required 'portion' field.`);
      return;
    }
    if (t.daysMask & (1 << dayIdx)) {
      total += t.portion;
    }
  });
  return total;
}





export function decodeMealPlanData(base64String: string, profile: { encodingFields: any[] }): FeedingTime[] {
  if (!base64String || base64String === 'unknown') return [];
  if (!profile || !Array.isArray(profile.encodingFields)) throw new Error('Invalid device profile for decoding');
  const fields = profile.encodingFields;
  const entrySize = fields.length;
  let binary: string;
  try {
    binary = atob(base64String);
  } catch {
    throw new Error('Invalid base64');
  }
  const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
  if (bytes.length % entrySize !== 0) throw new Error('Invalid meal plan length');
  return Array.from({ length: bytes.length / entrySize }, (_, i) => {
    const entry: any = {};
    for (let j = 0; j < fields.length; j++) {
      const prop = fields[j];
      entry[prop] = bytes[i * entrySize + j];
    }
    // Map and sanitize fields for UI robustness
    return {
      hour: typeof entry.hour === 'number' ? entry.hour : 0,
      minute: typeof entry.minute === 'number' ? entry.minute : 0,
      portion: typeof entry.portion === 'number' ? entry.portion : 1,
      daysMask: typeof entry.daysMask === 'number' ? entry.daysMask : 0,
      enabled: entry.enabled === 1 ? 1 : 0
    };
  });
}

export function encodeMealPlanData(feedingTimes: FeedingTime[], profile: { encodingFields: any[] }): string {
  if (!profile || !Array.isArray(profile.encodingFields)) throw new Error('Invalid device profile for encoding');
  const fields = profile.encodingFields;
  const bytes: number[] = [];
  feedingTimes.forEach((item, idx) => {
    for (const field of fields) {
      const prop = field;
      if (!(prop in item) || typeof (item as any)[prop] === 'undefined') {
        throw new Error(`Meal plan encode error: missing field '${prop}' in entry #${idx}. Possible layout mismatch or incomplete FeedingTime.`);
      }
      bytes.push(Number((item as any)[prop]));
    }
  });
  return btoa(String.fromCharCode(...bytes));
}

// Utility for UI formatting only
export function formatHourMinute(hour?: number, minute?: number): string {
  if (
    typeof hour !== 'number' || isNaN(hour) ||
    typeof minute !== 'number' || isNaN(minute) ||
    hour < 0 || hour > 23 ||
    minute < 0 || minute > 59
  ) return '--:--';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
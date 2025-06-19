/**
 * MealPlan State, Validation, Encoding/Decoding, and Feeding Schedule Utilities
 * All meal plan and feeding time logic is centralized here for maintainability.
 */

const GRAMS_PER_PORTION = 6;

export function decodeMealPlanData(base64String) {
    if (!base64String || base64String === 'unknown') return [];
    let binary;
    try { binary = atob(base64String); } catch { throw new Error('Invalid base64'); }
    const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
    if (bytes.length % 5 !== 0) throw new Error('Invalid meal plan length');
    const mealPlan = [];
    for (let i = 0; i < bytes.length; i += 5) {
        const [daysBits, hour, minute, portion, status] = bytes.slice(i, i + 5);
        mealPlan.push({
            time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            daysMask: daysBits,
            portion: portion || 1,
            enabled: status === 1,
            status
        });
    }
    return mealPlan;
}

export function encodeMealPlanData(feedingTimes) {
    const bytes = [];
    feedingTimes.forEach(item => {
        const [hour, minute] = item.time.split(":").map(Number);
        bytes.push(
            item.daysMask,
            hour,
            minute,
            Number(item.portion),
            item.enabled ? 1 : 0
        );
    });
    return btoa(String.fromCharCode(...bytes));
}

// Mealplan codec utilities for test compatibility
export function encodeMealPlan(feedingTimes) {
  if (!feedingTimes || feedingTimes.length === 0) return btoa('');
  return btoa(JSON.stringify(feedingTimes));
}

export function decodeMealPlan(encoded) {
  if (!encoded) return [];
  let binary;
  try {
    binary = atob(encoded);
  } catch {
    throw new Error('Invalid base64');
  }
  // Try JSON parse if it looks like JSON
  if (binary.trim().startsWith('[') || binary.trim().startsWith('{')) {
    try {
      return JSON.parse(binary);
    } catch {
      throw new Error('Invalid JSON meal plan');
    }
  }
  const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
  if (bytes.length % 5 !== 0) throw new Error('Invalid meal plan length');
  const mealPlan = [];
  for (let i = 0; i < bytes.length; i += 5) {
    const [daysBits, hour, minute, portion, status] = bytes.slice(i, i + 5);
    mealPlan.push({
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      daysMask: daysBits,
      portion: portion || 1,
      enabled: status === 1,
      status
    });
  }
  return mealPlan;
}

// Utility for meal plan state (plain JS, no Lit)
import DaysUtil from './days-util.js';

export function getNextSchedule(feedingTimes = []) {
  // Return '-' if no enabled times
  const enabled = feedingTimes.filter(ft => ft.enabled);
  if (!enabled.length) return '-';
  // Return the next scheduled time (simplified)
  return enabled[0].time || '-';
}

export function getTotalFoodPerDay(feedingTimes = []) {
  const totals = {};
  DaysUtil.DAYS.forEach(day => { totals[day] = 0; });
  feedingTimes.forEach(ft => {
    if (!ft.enabled) return;
    DaysUtil.bitmaskToDaysArray(ft.daysMask).forEach(day => {
      totals[day] += ft.portion || 0;
    });
  });
  return totals;
}

export function getTodaysFoodGrams(feedingTimes = [], today = 'Monday') {
  let total = 0;
  feedingTimes.forEach(ft => {
    if (!ft.enabled) return;
    if (DaysUtil.bitmaskToDaysArray(ft.daysMask).includes(today)) {
      total += ft.portion || 0;
    }
  });
  return total;
}

// Feeding time utilities for test compatibility
export function parseFeedingTime(str) {
  if (!str) return null;
  const [time, portion, ...days] = str.split(',');
  return {
    time,
    portion: Number(portion),
    days: days.join(',')
  };
}

export function formatFeedingTime(obj) {
  if (!obj) return '';
  return [obj.time, obj.portion, obj.days].join(',');
}

// Utility: deep compare two meal arrays (order and all fields) using hash string
export function mealsEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  // Use a stable key for each meal (time+portion+daysMask)
  const mealKey = m => `${m.time}|${m.portion}|${m.daysMask}`;
  // Build maps for both arrays
  const aMap = new Map(a.map(m => [mealKey(m), m.enabled]));
  const bMap = new Map(b.map(m => [mealKey(m), m.enabled]));
  if (aMap.size !== bMap.size) return false;
  for (const [key, enabledA] of aMap.entries()) {
    if (!bMap.has(key) || bMap.get(key) !== enabledA) return false;
  }
  return true;
}

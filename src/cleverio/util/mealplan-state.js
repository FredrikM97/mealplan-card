// Mealplan state utilities
export function getNextSchedule(feedingTimes) {
  if (!feedingTimes || feedingTimes.length === 0) return '-';
  const enabled = feedingTimes.filter(t => t.enabled);
  if (enabled.length === 0) return '-';
  enabled.sort((a, b) => a.time.localeCompare(b.time));
  return enabled[0].time;
}
export function getTotalFoodPerDay(feedingTimes) {
  const totals = {
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
export function getTodaysFoodGrams(feedingTimes, today) {
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
export function encodeMealPlanData(feedingTimes) {
  // Each entry: time (4 chars, e.g. 08:00), portion (1 byte), daysMask (1 byte), enabled (1 byte)
  const arr = feedingTimes.map(t => `${t.time},${t.portion},${t.daysMask},${t.enabled ? 1 : 0}`).join(';');
  return btoa(arr);
}
export function decodeMealPlanData(str) {
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
export function encodeMealPlan(feedingTimes) {
  // For legacy: encode as base64 of JSON
  return btoa(JSON.stringify(feedingTimes));
}
export function decodeMealPlan(str) {
  try {
    const arr = JSON.parse(atob(str));
    if (!Array.isArray(arr)) throw new Error('Invalid meal plan length');
    return arr;
  } catch (e) {
    throw new Error('Invalid meal plan length');
  }
}
export function parseFeedingTime(str) {
  // Format: "08:00,2,Monday,Tuesday"
  const [time, portion, ...days] = str.split(',');
  return { time, portion: Number(portion), days };
}
export function formatFeedingTime(obj) {
  return [obj.time, obj.portion, ...(obj.days || [])].join(',');
}
export function mealsEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((m, i) =>
    m.time === b[i].time &&
    m.portion === b[i].portion &&
    m.daysMask === b[i].daysMask &&
    m.enabled === b[i].enabled
  );
}

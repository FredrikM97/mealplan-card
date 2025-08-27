// Returns null if valid, or an error string if invalid

export interface FeedingTime {
  hour?: number;
  minute?: number;
  portion?: number;
  days?: number;
  enabled?: 0 | 1;
}

export function decodeMealPlanData(
  base64String: string,
  profile: { encodingFields: any[] },
): FeedingTime[] {
  if (!base64String || base64String === "unknown") return [];
  if (!profile || !Array.isArray(profile.encodingFields))
    throw new Error("Invalid device profile for decoding");
  const fields = profile.encodingFields;
  const entrySize = fields.length;
  let binary: string;
  try {
    binary = atob(base64String);
  } catch {
    throw new Error("Invalid base64");
  }
  const bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
  if (bytes.length % entrySize !== 0)
    throw new Error("Invalid meal plan length");
  const rawData = Array.from({ length: bytes.length / entrySize }, (_, i) => {
    const entry: any = {};
    for (let j = 0; j < fields.length; j++) {
      const prop = fields[j];
      entry[prop] = bytes[i * entrySize + j];
    }
    return entry;
  });
  return convertFromDecoded(rawData, profile);
}

export function encodeMealPlanData(
  mealPlan: any[],
  profile: { encodingFields: any[] },
): string {
  if (!profile || !Array.isArray(profile.encodingFields))
    throw new Error("Invalid device profile for encoding");
  const fields = profile.encodingFields;
  const rawData = convertToEncoded(mealPlan, profile);
  const bytes: number[] = [];
  rawData.forEach((item, idx) => {
    for (const field of fields) {
      const prop = field;
      if (!(prop in item) || typeof (item as any)[prop] === "undefined") {
        throw new Error(
          `Meal plan encode error: missing field '${prop}' in entry #${idx}. Possible layout mismatch or incomplete FeedingTime.`,
        );
      }
      bytes.push(Number((item as any)[prop]));
    }
  });
  return btoa(String.fromCharCode(...bytes));
}

export function convertFromDecoded(
  rawData: any[],
  profile: { encodingFields: any[] },
): FeedingTime[] {
  return rawData.map((entry) => {
    const { minute_high, minute_low, ...sanitizedEntry } = entry;
    if (
      profile.encodingFields.includes("minute_high") &&
      profile.encodingFields.includes("minute_low")
    ) {
      const totalMinutes = minute_low + (minute_high << 8);
      sanitizedEntry.hour = Math.floor(totalMinutes / 60);
      sanitizedEntry.minute = totalMinutes % 60;
    }
    return sanitizedEntry;
  });
}

export function convertToEncoded(
  mealPlan: FeedingTime[],
  profile: { encodingFields: any[] },
): any[] {
  if (
    profile.encodingFields.includes("minute_high") &&
    profile.encodingFields.includes("minute_low")
  ) {
    return mealPlan.map((entry) => {
      const { hour, minute, ...rest } = entry;
      if (hour !== undefined && minute !== undefined) {
        const totalMinutes = hour * 60 + minute;
        const lowByte = totalMinutes & 0xff;
        const highByte = totalMinutes >> 8;
        return {
          ...rest,
          minute_high: highByte,
          minute_low: lowByte,
        };
      }
      return rest;
    });
  }
  return mealPlan;
}

// Utility for UI formatting only
export function formatHourMinute(hour?: number, minute?: number): string {
  if (
    typeof hour !== "number" ||
    isNaN(hour) ||
    typeof minute !== "number" ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  )
    return "--:--";
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

// Migrated to TypeScript
import { describe, expect, it } from "vitest";
import {
  encodeMealPlanData,
  decodeMealPlanData,
  FeedingTime,
  formatHourMinute,
} from "../../src/util/mealplan-state";

describe("Mealplan State", () => {
  it("decodeMealPlanData returns [] for base64String unknown", () => {
    const result = decodeMealPlanData("unknown", {
      encodingFields: ["hour", "minute", "portion", "enabled"],
    });
    expect(result).toEqual([]);
  });

  it("encodeMealPlanData returns empty string for empty feedingTimes", () => {
    const encoded = encodeMealPlanData([], {
      encodingFields: ["hour", "minute", "portion", "enabled"],
    });
    expect(encoded).toBe("");
  });
  // Only keep a generic round-trip test for encode/decode
  it("encodeMealPlanData and decodeMealPlanData are inverses for generic data", () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, days: 0b1000001, portion: 1, enabled: 0 },
    ];
    const encoded = encodeMealPlanData(feedingTimes, {
      encodingFields: ["days", "hour", "minute", "portion", "enabled"],
    });
    const decoded = decodeMealPlanData(encoded, {
      encodingFields: ["days", "hour", "minute", "portion", "enabled"],
    });
    expect(decoded).toEqual(feedingTimes);
  });
});

//

describe("decodeMealPlanData/encodeMealPlanData error handling", () => {
  it("throws on invalid base64", () => {
    expect(() =>
      decodeMealPlanData("!@#$", { encodingFields: ["hour"] }),
    ).toThrow("Invalid base64");
  });
  it("throws on invalid profile", () => {
    expect(() =>
      decodeMealPlanData("AA==", { encodingFields: undefined as any }),
    ).toThrow("Invalid device profile for decoding");
    expect(() =>
      encodeMealPlanData([], { encodingFields: undefined as any }),
    ).toThrow("Invalid device profile for encoding");
  });
  it("throws on invalid meal plan length", () => {
    // 2 bytes, but 3 fields expected
    expect(() =>
      decodeMealPlanData("AAA=", {
        encodingFields: ["hour", "minute", "portion"],
      }),
    ).toThrow("Invalid meal plan length");
  });
  it("throws on missing field in encode", () => {
    expect(() =>
      encodeMealPlanData(
        [
          {
            hour: 8,
            minute: 0,
            portion: undefined as any,
            enabled: undefined as any,
          },
        ],
        { encodingFields: ["hour", "minute", "portion"] },
      ),
    ).toThrow();
  });
});

describe("formatHourMinute", () => {
  it("formats valid hour/minute", () => {
    expect(formatHourMinute(8, 5)).toBe("08:05");
    expect(formatHourMinute(23, 59)).toBe("23:59");
  });
  it("returns --:-- for invalid input", () => {
    expect(formatHourMinute(undefined, 0)).toBe("--:--");
    expect(formatHourMinute(8, undefined)).toBe("--:--");
    expect(formatHourMinute(NaN, 0)).toBe("--:--");
    expect(formatHourMinute(-1, 0)).toBe("--:--");
    expect(formatHourMinute(8, 60)).toBe("--:--");
  });
});

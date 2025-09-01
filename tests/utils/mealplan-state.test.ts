// Migrated to TypeScript
import { describe, expect, it } from "vitest";
import { getEncoder, FeedingTime } from "../../src/util/serializer";
import { EncodingField } from "../../src/profiles/types";
import { formatHourMinute } from "../../src/util/days-util";

describe("Mealplan State", () => {
  const encoder = getEncoder({
    fields: [],
    profiles: [],
    encodingFields: [
      EncodingField.HOUR,
      EncodingField.MINUTE,
      EncodingField.PORTION,
      EncodingField.ENABLED,
    ],
  });
  it("decodeMealPlanData returns [] for base64String unknown", () => {
    const result = encoder.decode("unknown");
    expect(result).toEqual([]);
  });

  it("encodeMealPlanData returns empty string for empty feedingTimes", () => {
    const encoded = encoder.encode([]);
    expect(encoded).toBe("");
  });
  // Only keep a generic round-trip test for encode/decode
  it("encodeMealPlanData and decodeMealPlanData are inverses for generic data", () => {
    const encoder2 = getEncoder({
      fields: [],
      profiles: [],
      encodingFields: [
        EncodingField.HOUR,
        EncodingField.MINUTE,
        EncodingField.DAYS,
        EncodingField.PORTION,
        EncodingField.ENABLED,
      ],
    });
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, days: 0b1000001, portion: 1, enabled: 0 },
    ];
    const encoded = encoder2.encode(feedingTimes);
    const decoded = encoder2.decode(encoded);
    expect(decoded).toEqual(feedingTimes);
  });
});

//

describe("decodeMealPlanData/encodeMealPlanData error handling", () => {
  it("throws on invalid base64", () => {
    const encoder = getEncoder({
      fields: [],
      profiles: [],
      encodingFields: [EncodingField.HOUR],
    });
    expect(() => encoder.decode("!@#$")).toThrow("Invalid base64");
  });
  it("throws on invalid profile", () => {
    expect(() =>
      getEncoder({
        fields: [],
        profiles: [],
        encodingFields: undefined as any,
      }),
    ).toThrow("Invalid device profile for encoding/decoding");
  });
  it("throws on invalid meal plan length", () => {
    // 2 bytes, but 3 fields expected
    const encoder = getEncoder({
      fields: [],
      profiles: [],
      encodingFields: [
        EncodingField.HOUR,
        EncodingField.MINUTE,
        EncodingField.PORTION,
      ],
    });
    expect(() => encoder.decode("AAA=")).toThrow("Invalid meal plan length");
  });
  it("throws on missing field in encode", () => {
    const encoder = getEncoder({
      fields: [],
      profiles: [],
      encodingFields: [
        EncodingField.HOUR,
        EncodingField.MINUTE,
        EncodingField.PORTION,
      ],
    });

    expect(() =>
      encoder.encode([
        {
          hour: 8,
          minute: 0,
          portion: undefined as any,
          enabled: undefined as any,
        },
      ]),
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

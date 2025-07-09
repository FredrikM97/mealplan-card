import { describe, it, expect } from "vitest";
import { profiles } from "../../src/profiles/profiles";
import {
  encodeMealPlanData,
  decodeMealPlanData,
  FeedingTime,
} from "../../src/util/mealplan-state";

// Find the HoneyGuardian profile from the grouped structure
const honeyguardianProfile = profiles.find((group) =>
  group.profiles.some((p) => p.manufacturer === "HoneyGuardian"),
);

describe("honeyguardianProfile encoding/decoding", () => {
  if (!honeyguardianProfile)
    throw new Error("HoneyGuardian profile not found in profiles array");

  const feedingTimes: FeedingTime[] = [
    { hour: 6, minute: 0, portion: 1, enabled: 1 },
    { hour: 18, minute: 0, portion: 2, enabled: 0 },
  ];

  it("encodes and decodes meal plan data correctly", () => {
    const encoded = encodeMealPlanData(feedingTimes, {
      encodingFields: honeyguardianProfile.encodingFields!,
    });
    const decoded = decodeMealPlanData(encoded, {
      encodingFields: honeyguardianProfile.encodingFields!,
    });
    expect(decoded).toEqual([
      { hour: 6, minute: 0, portion: 1, enabled: 1, days: 0 },
      { hour: 18, minute: 0, portion: 2, enabled: 0, days: 0 },
    ]);
  });

  it("throws on invalid base64", () => {
    expect(() =>
      decodeMealPlanData("!@#$", {
        encodingFields: honeyguardianProfile.encodingFields!,
      }),
    ).toThrow();
  });

  // Added: minimal decode test from decode-profile.test.ts
  it("decodes Honeyguardian base64 (minimal)", () => {
    const base64 = "DAABAQweAgENAAQBDR4DAQ4ABAEOHgYB";
    const result = decodeMealPlanData(base64, {
      encodingFields: honeyguardianProfile.encodingFields ?? [],
    });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

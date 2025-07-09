import { describe, it, expect } from 'vitest';
import { profiles } from '../../src/profiles/profiles';
import { encodeMealPlanData, decodeMealPlanData, FeedingTime } from '../../src/util/mealplan-state';

// Find the Cleverio profile from the grouped structure
const cleverioProfile = profiles.find(group =>
  group.profiles.some(p => p.manufacturer === 'Cleverio')
);

describe('cleverioProfile encoding/decoding', () => {
  if (!cleverioProfile) throw new Error('Cleverio profile not found in profiles array');

  const feedingTimes: FeedingTime[] = [
    { hour: 8, minute: 0, portion: 2, daysMask: 127, enabled: 1 },
    { hour: 18, minute: 0, portion: 1, daysMask: 62, enabled: 0 },
  ];

  it('encodes and decodes meal plan data correctly', () => {
    const encoded = encodeMealPlanData(feedingTimes, { encodingFields: cleverioProfile.encodingFields! });
    const decoded = decodeMealPlanData(encoded, { encodingFields: cleverioProfile.encodingFields! });
    expect(decoded).toEqual(feedingTimes);
  });

  it('throws on invalid base64', () => {
    expect(() => decodeMealPlanData('!@#$', { encodingFields: cleverioProfile.encodingFields! })).toThrow();
  });

  it('decodes real device base64 and encodeMealPlanData re-encodes it correctly', () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const expected = [
      { daysMask: 127, portion: 1, hour: 4, minute: 0, enabled: 0 },
      { daysMask: 127, portion: 2, hour: 9, minute: 0, enabled: 1 },
      { daysMask: 127, portion: 1, hour: 15, minute: 0, enabled: 1 },
      { daysMask: 127, portion: 2, hour: 21, minute: 0, enabled: 1 },
      { daysMask: 8, portion: 1, hour: 18, minute: 0, enabled: 0 }
    ];
    const decoded = decodeMealPlanData(base64, cleverioProfile as { encodingFields: any[] });
    expect(decoded).toEqual(expected);
    // Re-encode and decode again to check round-trip
    const reEncoded = encodeMealPlanData(decoded, cleverioProfile as { encodingFields: any[] });
    const roundTrip = decodeMealPlanData(reEncoded, cleverioProfile as { encodingFields: any[] });
    expect(roundTrip).toEqual(expected);
  });

  // Added: minimal decode test from decode-profile.test.ts
  it('decodes Cleverio PF100 base64 (minimal)', () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const result = decodeMealPlanData(base64, { encodingFields: cleverioProfile.encodingFields ?? [] });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

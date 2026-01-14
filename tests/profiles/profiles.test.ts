import { describe, it, expect } from 'vitest';
import { getEncoder } from '../../src/profiles/serializer';
import { getProfileWithTransformer } from '../../src/profiles/profiles';
import profileTestData from '../fixtures/profiles-test-data.json';
import type { FeedingTime } from '../../src/types';
import { profiles } from '../../src/profiles/profiles';

const INVALID_BASE64 = '!@#$';

type ProfileTestCase = {
  manufacturer: string;
  decoded: FeedingTime[];
  encoded: string;
};

(profileTestData as ProfileTestCase[]).forEach((testCase) => {
  const { manufacturer, decoded, encoded } = testCase;

  describe(manufacturer, () => {
    const profileGroup = getProfileWithTransformer(manufacturer);

    if (!profileGroup) {
      it.skip(`profile not found in source`, () => {});
      return;
    }

    const encoder = getEncoder(profileGroup);

    it('encodes meals to base64', () => {
      const result = encoder.encode(decoded);
      if (encoded) {
        expect(result).toBe(encoded);
      } else {
        expect(typeof result).toBe('string');
      }
    });

    it('decodes base64 to meals', () => {
      if (!encoded) return;
      const result = encoder.decode(encoded);
      expect(result).toEqual(decoded);
    });

    it('roundtrip encode/decode preserves data', () => {
      if (!decoded || decoded.length === 0) return;
      const encodedResult = encoder.encode(decoded);
      const decodedResult = encoder.decode(encodedResult);
      expect(decodedResult).toEqual(decoded);
    });

    it('throws error on invalid base64', () => {
      expect(() => encoder.decode(INVALID_BASE64)).toThrow();
    });
  });
});

describe('Profile Coverage', () => {
  it('all profiles from profiles.ts should have a fixture in profiles-test-data.json', () => {
    const fixtureManufacturers = new Set(
      (profileTestData as ProfileTestCase[]).map((tc) => tc.manufacturer),
    );

    const missingFixtures = profiles
      .map((p) => p.manufacturer)
      .filter((manufacturer) => !fixtureManufacturers.has(manufacturer));

    expect(
      missingFixtures,
      `All profiles must have fixtures. Missing: ${missingFixtures.join(', ')}`,
    ).toEqual([]);
  });
});

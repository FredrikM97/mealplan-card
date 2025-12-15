import { describe, it, expect } from 'vitest';
import { getEncoder } from '../../src/profiles/serializer';
import { profiles } from '../../src/profiles/profiles';
import profileTestData from '../fixtures/profiles-test-data.json';

const INVALID_BASE64 = '!@#$';

(profileTestData as any[]).forEach((testCase) => {
  const { manufacturer, decoded, encoded } = testCase;

  describe(manufacturer, () => {
    const profileGroup = profiles.find((p) => p.manufacturer === manufacturer);

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

import { describe, it, expect } from 'vitest';
import { getEncoder } from '../../src/util/serializer';
import fixtureProfiles from './fixture-profiles.json';
import { resolveProfile } from '../../src/profiles/resolveProfile';
const INVALID_BASE64 = '!@#$';

describe.each(fixtureProfiles as any[])(
  'fixture-profiles encode/decode: %o',
  (fixture) => {
    const { manufacturer, decoded, encoded } = fixture;
    const profileGroup = resolveProfile({ device_manufacturer: manufacturer });
    if (!profileGroup) {
      it.skip(`${manufacturer}: profile not found in source profiles`, () => {});
      return;
    }
    const encoder = getEncoder(profileGroup);
    it(`${manufacturer}: encodes feedingTimes to base64`, () => {
      const result = encoder.encode(decoded);
      if (encoded) {
        expect(result).toBe(encoded);
      } else {
        expect(typeof result).toBe('string');
      }
    });
    it(`${manufacturer}: decodes base64 to feedingTimes`, () => {
      if (!encoded) return;
      const result = encoder.decode(encoded);
      expect(result).toEqual(decoded);
    });
    it(`${manufacturer}: encode/decode roundtrip`, () => {
      if (!decoded || decoded.length === 0) return;
      const encodedResult = encoder.encode(decoded);
      const decodedResult = encoder.decode(encodedResult);
      expect(decodedResult).toEqual(decoded);
    });
    it(`${manufacturer}: throws on invalid base64`, () => {
      expect(() => encoder.decode(INVALID_BASE64)).toThrow();
    });
  },
);

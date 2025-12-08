import { describe, it, expect } from 'vitest';
import { getEncoder } from '../../src/profiles/serializer';
import fixtureProfiles from './fixture-profiles.json';
// resolveProfile is now internal to card-editor, testing via profiles directly
import { profiles } from '../../src/profiles/profiles';
const INVALID_BASE64 = '!@#$';

describe.each(fixtureProfiles as any[])(
  'fixture-profiles encode/decode: %o',
  (fixture) => {
    const { manufacturer, decoded, encoded } = fixture;

    // Find profile directly from profiles array
    const profileGroup = profiles.find((group) =>
      group.profiles.some((p) => p.manufacturer === manufacturer),
    );

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

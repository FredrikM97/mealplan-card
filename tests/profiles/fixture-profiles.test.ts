import { describe, it, expect } from "vitest";
import { encodeMealPlanData, decodeMealPlanData } from "../../src/util/mealplan-state";
import { profiles } from "../../src/profiles/profiles";
import fixtureProfiles from "./fixture-profiles.json";

const INVALID_BASE64 = "!@#$";

describe.each(fixtureProfiles as any[])('fixture-profiles encode/decode: %o', (fixture) => {
  const { manufacturer, decoded, encoded } = fixture;
  const profileGroup = profiles.find((group) =>
    group.profiles.some((p) => p.manufacturer === manufacturer)
  );
  if (!profileGroup) {
    it.skip(`${manufacturer}: profile not found in source profiles`, () => {});
    return;
  }
  it(`${manufacturer}: encodes feedingTimes to base64`, () => {
    const result = encodeMealPlanData(decoded, { encodingFields: profileGroup.encodingFields });
    if (encoded) {
      expect(result).toBe(encoded);
    } else {
      expect(typeof result).toBe("string");
    }
  });
  it(`${manufacturer}: decodes base64 to feedingTimes`, () => {
    if (!encoded) return;
    const result = decodeMealPlanData(encoded, { encodingFields: profileGroup.encodingFields });
    expect(result).toEqual(decoded);
  });
  it(`${manufacturer}: encode/decode roundtrip`, () => {
    if (!decoded || decoded.length === 0) return;
    const encodedResult = encodeMealPlanData(decoded, { encodingFields: profileGroup.encodingFields });
    const decodedResult = decodeMealPlanData(encodedResult, { encodingFields: profileGroup.encodingFields });
    expect(decodedResult).toEqual(decoded);
    });
  it(`${manufacturer}: throws on invalid base64`, () => {
    expect(() =>
      decodeMealPlanData(INVALID_BASE64, {
        encodingFields: profileGroup.encodingFields,
      })
    ).toThrow();
  });
});

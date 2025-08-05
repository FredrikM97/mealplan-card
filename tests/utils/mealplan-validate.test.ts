import { describe, expect, it } from "vitest";
import { validateFeedingTime } from "../../src/util/mealplan-validate";

describe("validateFeedingTime", () => {
  it("returns error for invalid hour/minute", () => {
    expect(validateFeedingTime({ hour: -1, minute: 0, portion: 1 })).toBe(
      "Please enter a valid time.",
    );
    expect(validateFeedingTime({ hour: 8, minute: 60, portion: 1 })).toBe(
      "Please enter a valid time.",
    );
    expect(validateFeedingTime({ hour: NaN, minute: 0, portion: 1 })).toBe(
      "Please enter a valid time.",
    );
  });
  it("returns error for missing/invalid portion", () => {
    expect(validateFeedingTime({ hour: 8, minute: 0, portion: 0 })).toBe(
      "Portion must be at least 1.",
    );
    expect(validateFeedingTime({ hour: 8, minute: 0 })).toBe(
      "Portion must be at least 1.",
    );
  });
  it("returns null for valid input", () => {
    expect(validateFeedingTime({ hour: 8, minute: 0, portion: 1 })).toBeNull();
  });
});

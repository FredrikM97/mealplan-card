
import { describe, expect, it } from "vitest";
import { bitmaskToDays, daysToBitmask, Day } from "../../src/util/days-util";


describe("days-util bitmask/enum", () => {

  it("daysToBitmask and bitmaskToDays roundtrip", () => {
    const days = [Day.Monday, Day.Wednesday, Day.Friday];
    const mask = daysToBitmask(days);
    expect(bitmaskToDays(mask)).toEqual(days);
  });

  it("bitmaskToDays returns empty for 0", () => {
    expect(bitmaskToDays(0)).toEqual([]);
  });

  it("daysToBitmask returns 0 for empty", () => {
    expect(daysToBitmask([])).toBe(0);
  });
});

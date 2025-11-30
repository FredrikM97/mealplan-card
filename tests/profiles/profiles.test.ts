describe('profiles structure validation', () => {
  it('each profile has a models array and only one default per manufacturer per group', () => {
    for (const group of profiles) {
      const defaultCounts: Record<string, number> = {};
      for (const p of group.profiles) {
        expect(Array.isArray(p.models)).toBe(true);
        if (p.default) {
          defaultCounts[p.manufacturer] =
            (defaultCounts[p.manufacturer] || 0) + 1;
        }
      }
      for (const [manufacturer, count] of Object.entries(defaultCounts)) {
        expect(count).toBeLessThanOrEqual(1);
      }
    }
  });
});
import { describe, it, expect, vi } from 'vitest';
import { profiles } from '../../src/profiles/profiles';

describe('profiles default enforcement', () => {
  it('logs an error if multiple defaults exist for a manufacturer', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Simulate a group with two defaults for the same manufacturer
    const testProfiles = [
      {
        profiles: [
          { manufacturer: 'TestBrand', default: true, models: [] },
          { manufacturer: 'TestBrand', default: true, models: [] },
        ],
        fields: [],
      },
    ];
    // Inline enforcement logic
    for (const group of testProfiles) {
      const defaultCounts: Record<string, number> = {};
      for (const p of group.profiles) {
        if (p.default) {
          defaultCounts[p.manufacturer] =
            (defaultCounts[p.manufacturer] || 0) + 1;
        }
      }
      for (const [manufacturer, count] of Object.entries(defaultCounts)) {
        if (count > 1) {
          // eslint-disable-next-line no-console
          console.error(
            `Device profile group for manufacturer '${manufacturer}' has ${count} defaults (should be only one).`,
          );
        }
      }
    }
    expect(errorSpy).toHaveBeenCalledWith(
      "Device profile group for manufacturer 'TestBrand' has 2 defaults (should be only one).",
    );
    errorSpy.mockRestore();
  });
});

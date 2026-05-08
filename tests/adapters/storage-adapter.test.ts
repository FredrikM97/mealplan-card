import { describe, it, expect, vi } from 'vitest';
import { TuyaServiceAdapter } from '../../src/adapters/storage-adapter';
import { createMockHass, getTestProfile } from '../fixtures/factories';

describe('TuyaServiceAdapter', () => {
  it('isDataAvailable returns true without reading device data', async () => {
    const callWS = vi.fn();
    const hass = createMockHass({
      overrides: {
        callWS,
      },
    });

    const adapter = new TuyaServiceAdapter(
      () => hass,
      getTestProfile(),
      'test-device-id',
      'tuya.read_meal_plan',
      'tuya.write_meal_plan',
    );

    await expect(adapter.isDataAvailable()).resolves.toBe(true);
    expect(callWS).toHaveBeenCalledTimes(0);
  });
});

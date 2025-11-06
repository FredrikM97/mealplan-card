// Additional coverage/edge-case tests merged from resolveProfile.coverage.test.ts and schedule-schema/resolveProfile.coverage.test.ts
describe('resolveProfile edge cases', () => {
  it('returns undefined and warns if device_manufacturer is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = resolveProfile({});
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      'No device_manufacturer specified in config',
    );
    warn.mockRestore();
  });

  it('returns undefined and warns if no matching profile is found', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = resolveProfile({
      device_manufacturer: 'NotARealBrand',
      device_model: 'X',
    });
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      'No matching profile found for',
      'NotARealBrand',
      'X',
    );
    warn.mockRestore();
  });

  it('handles missing models property gracefully', () => {
    const profiles = [
      {
        profiles: [{ manufacturer: 'NoModels' }],
        fields: [],
        encodingFields: [],
      },
    ];
    const result = resolveProfile.call(
      { profiles },
      { device_manufacturer: 'NoModels' },
    );
    expect(result).toBeUndefined();
  });

  it('getProfileDropdownItems warns if a profile is missing manufacturer', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const testProfiles = [
      {
        profiles: [{ manufacturer: '', models: [] }],
        fields: [],
        encodingFields: [],
      },
    ];
    getProfileDropdownItems(testProfiles as any);
    expect(warn).toHaveBeenCalledWith('Device profile missing manufacturer:', {
      manufacturer: '',
      models: [],
    });
    warn.mockRestore();
  });
});

import { describe, it, expect, vi } from 'vitest';
import {
  resolveProfile,
  getProfileDropdownItems,
} from '../../src/profiles/resolveProfile';
import { profiles } from '../../src/profiles/profiles';

const cleverioProfile = {
  profiles: [{ manufacturer: 'Cleverio', default: true, models: [] }],
  fields: ['time', 'portion', 'days', 'enabled', 'edit', 'delete', 'add'],
  encodingFields: ['days', 'hour', 'minute', 'portion', 'enabled'],
};

const honeyguardianProfile = {
  profiles: [{ manufacturer: 'HoneyGuardian', default: true, models: [] }],
  fields: ['time', 'portion', 'enabled', 'edit', 'delete', 'add'],
  encodingFields: ['hour', 'minute', 'portion', 'enabled'],
};

describe('resolveProfile', () => {
  it('returns undefined and warns if device_manufacturer is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = resolveProfile({});
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      'No device_manufacturer specified in config',
    );
    warn.mockRestore();
  });

  it('returns undefined and warns if no matching profile is found', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = resolveProfile({
      device_manufacturer: 'NotARealBrand',
      device_model: 'X',
    });
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      'No matching profile found for',
      'NotARealBrand',
      'X',
    );
    warn.mockRestore();
  });

  it('handles missing models property gracefully', () => {
    const profiles = [
      {
        profiles: [{ manufacturer: 'NoModels' }],
        fields: [],
        encodingFields: [],
      },
    ];
    const result = resolveProfile.call(
      { profiles },
      { device_manufacturer: 'NoModels' },
    );
    expect(result).toBeUndefined();
  });
});

describe('getProfileDropdownItems', () => {
  it('warns if a profile is missing manufacturer', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const testProfiles = [
      {
        profiles: [{ manufacturer: '', models: ['A'] }],
        fields: [],
        encodingFields: [],
      },
    ];
    getProfileDropdownItems(testProfiles as any);
    expect(warn).toHaveBeenCalledWith('Device profile missing manufacturer:', {
      manufacturer: '',
      models: ['A'],
    });
    warn.mockRestore();
  });

  it('warns if a profile is missing manufacturer (empty models)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const testProfiles = [
      {
        profiles: [{ manufacturer: '', models: [] }],
        fields: [],
        encodingFields: [],
      },
    ];
    getProfileDropdownItems(testProfiles as any);
    expect(warn).toHaveBeenCalledWith('Device profile missing manufacturer:', {
      manufacturer: '',
      models: [],
    });
    warn.mockRestore();
  });
});

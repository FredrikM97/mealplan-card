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
  findProfileByKey,
} from '../../src/profiles/resolveProfile';
import { profiles } from '../../src/profiles/profiles';

const cleverioProfile = {
  profiles: [{ manufacturer: 'Cleverio', default: true, models: [] }],
  fields: ['time', 'portion', 'days', 'enabled', 'edit', 'delete', 'add'],
};

const honeyguardianProfile = {
  profiles: [{ manufacturer: 'HoneyGuardian', default: true, models: [] }],
  fields: ['time', 'portion', 'enabled', 'edit', 'delete', 'add'],
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
        profiles: [{ manufacturer: '', models: [] }],
        fields: [],
      },
    ];
    getProfileDropdownItems(testProfiles as any);
    expect(warn).toHaveBeenCalledWith('Device profile missing manufacturer:', {
      manufacturer: '',
      models: [],
    });
    warn.mockRestore();
  });

  it('creates dropdown items with model suffix for multi-model profiles', () => {
    const testProfiles = [
      {
        profiles: [{ manufacturer: 'TestBrand', models: ['ModelA', 'ModelB'] }],
        fields: [],
      },
    ];
    const items = getProfileDropdownItems(testProfiles as any);
    expect(items).toContainEqual({
      value: 'TestBrand:ModelA',
      label: 'TestBrand - ModelA',
    });
    expect(items).toContainEqual({
      value: 'TestBrand:ModelB',
      label: 'TestBrand - ModelB',
    });
  });

  it('creates dropdown items without model suffix for single-model profiles', () => {
    const testProfiles = [
      {
        profiles: [{ manufacturer: 'SingleModel', models: ['OnlyOne'] }],
        fields: [],
      },
    ];
    const items = getProfileDropdownItems(testProfiles as any);
    expect(items).toContainEqual({
      value: 'SingleModel:OnlyOne',
      label: 'SingleModel',
    });
  });
});

describe('findProfileByKey', () => {
  it('finds profile by manufacturer and model', () => {
    const testProfiles = [
      {
        profiles: [{ manufacturer: 'TestManu', models: ['Model1', 'Model2'] }],
        fields: ['test'],
      },
    ];
    const result = findProfileByKey(testProfiles as any, 'TestManu:Model1');
    expect(result).toBeDefined();
    expect(result?.fields).toEqual(['test']);
  });

  it('finds profile with no model when key has no model', () => {
    const testProfiles = [
      {
        profiles: [{ manufacturer: 'NoModelManu', models: [] }],
        fields: ['test2'],
      },
    ];
    const result = findProfileByKey(testProfiles as any, 'NoModelManu:');
    expect(result).toBeDefined();
    expect(result?.fields).toEqual(['test2']);
  });

  it('returns undefined for non-existent profile', () => {
    const result = findProfileByKey(profiles, 'NonExistent:Model');
    expect(result).toBeUndefined();
  });
});

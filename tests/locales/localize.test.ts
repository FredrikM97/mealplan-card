import { describe, it, expect } from 'vitest';
import { setLanguage, localize } from '../../src/locales/localize';

describe('localize', () => {
  it('setLanguage falls back to "en" for unknown language', () => {
    setLanguage('unknown-lang');
    expect(localize('schedule')).toBe('Schedule');
  });

  it('setLanguage accepts valid language', () => {
    setLanguage('sv');
    expect(localize('schedule')).toBe('Schema');
    // Reset to English
    setLanguage('en');
  });

  it('localize returns key when translation not found', () => {
    expect(localize('non_existent_key')).toBe('non_existent_key');
  });
});

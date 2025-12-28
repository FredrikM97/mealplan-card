import { describe, it, expect } from 'vitest';
import { setLanguage, localize } from '../../src/locales/localize';

describe('localize', () => {
  it('setLanguage falls back to "en" for unknown language', () => {
    setLanguage('unknown-lang');
    expect(localize('common.back')).toBe('Back');
  });

  it('setLanguage accepts valid language', () => {
    setLanguage('sv');
    expect(localize('common.back')).toBe('Tillbaka');
    // Reset to English
    setLanguage('en');
  });

  it('localize returns key when translation not found', () => {
    expect(localize('non_existent_key')).toBe('non_existent_key');
  });

  it('localize supports nested paths', () => {
    expect(localize('config.sensor_label')).toBe('Meal Plan Sensor');
    expect(localize('schedule_view.manage_schedules')).toBe('Manage Schedules');
    expect(localize('main.configuration_required')).toBe(
      'Configuration required',
    );
  });

  it('localize works with Swedish nested paths', () => {
    setLanguage('sv');
    expect(localize('config.sensor_label')).toBe('Meal Plan-sensor');
    expect(localize('schedule_view.manage_schedules')).toBe('Hantera scheman');
    expect(localize('main.configuration_required')).toBe('Konfiguration krävs');
    // Reset to English
    setLanguage('en');
  });
});

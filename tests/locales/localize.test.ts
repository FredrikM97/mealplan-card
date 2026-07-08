import { describe, it, expect } from 'vitest';
import {
  setLanguage,
  localize,
  translations,
} from '../../src/locales/localize';
import en from '../../src/locales/en.json';

describe('localize', () => {
  it('setLanguage keeps current language for unknown language', () => {
    // Ensure default language first
    setLanguage('en');
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
    expect(localize('schedule_view.manage_schedules')).toBe('Manage');
    expect(localize('main.configuration_required')).toBe(
      'Configuration required',
    );
  });

  it('localize works with Swedish nested paths', () => {
    setLanguage('sv');
    expect(localize('config.sensor_label')).toBe('Meal Plan-sensor');
    expect(localize('schedule_view.manage_schedules')).toBe('Hantera');
    expect(localize('main.configuration_required')).toBe('Konfiguration krävs');
    // Reset to English
    setLanguage('en');
  });

  it('localize works with Spanish nested paths', () => {
    setLanguage('es');
    expect(localize('common.back')).toBe('Atrás');
    expect(localize('schedule_view.manage_schedules')).toBe('Gestionar');
    expect(localize('overview.avg_week')).toBe('Media/semana');
    expect(localize('main.configuration_required')).toBe(
      'Se requiere configuración',
    );
    // Reset to English
    setLanguage('en');
  });

  it('setLanguage supports regional variants (es-ES -> es)', () => {
    setLanguage('es-ES');
    expect(localize('common.back')).toBe('Atrás');
    // Reset to English
    setLanguage('en');
  });

  describe('locale property validation', () => {
    function getAllKeys(
      obj: Record<string, unknown>,
      prefix = '',
    ): Set<string> {
      const keys = new Set<string>();
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.add(fullKey);
        if (typeof value === 'object' && value !== null) {
          const nestedKeys = getAllKeys(
            value as Record<string, unknown>,
            fullKey,
          );
          nestedKeys.forEach((k) => keys.add(k));
        }
      }
      return keys;
    }

    it('all locale files have the same properties as en.json', () => {
      const enKeys = getAllKeys(en);

      Object.entries(translations)
        .filter(([lang]) => lang !== 'en')
        .forEach(([locale, localeData]) => {
          const localeKeys = getAllKeys(localeData as Record<string, unknown>);

          // Check for missing keys
          const missingKeys = Array.from(enKeys).filter(
            (key) => !localeKeys.has(key),
          );
          if (missingKeys.length > 0) {
            throw new Error(
              `Locale '${locale}' is missing keys: ${missingKeys.join(', ')}`,
            );
          }

          // Check for extra keys
          const extraKeys = Array.from(localeKeys).filter(
            (key) => !enKeys.has(key),
          );
          if (extraKeys.length > 0) {
            throw new Error(
              `Locale '${locale}' has extra keys: ${extraKeys.join(', ')}`,
            );
          }
        });

      expect(true).toBe(true);
    });
  });
});

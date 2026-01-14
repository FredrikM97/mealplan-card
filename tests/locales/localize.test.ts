import { describe, it, expect } from 'vitest';
import { setLanguage, localize } from '../../src/locales/localize';

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

  it('localize works with Spanish nested paths', () => {
    setLanguage('es');
    expect(localize('common.back')).toBe('Atrás');
    expect(localize('schedule_view.manage_schedules')).toBe(
      'Gestionar horarios',
    );
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
});

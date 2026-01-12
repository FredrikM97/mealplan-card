import en from './en.json';
import sv from './sv.json';
import ru from './ru.json';
import es from './es.json';

type Translation = Record<string, any>;
const translations: Record<string, Translation> = { en, sv, ru, es };

let currentLang = 'en';

export function setLanguage(lang?: string) {
  const normalized = (lang ?? '').toLowerCase();
  const base = normalized.split('-')[0];

  if (translations?.[normalized]) {
    currentLang = normalized;
  } else if (translations?.[base]) {
    currentLang = base;
  } else {
    currentLang = 'en';
  }
}

/**
 * Resolve a nested path in an object (e.g., "config.sensor_label")
 */
function resolvePath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function localize(key: string): string {
  const value =
    resolvePath(translations[currentLang], key) ??
    resolvePath(translations.en, key) ??
    key;
  return typeof value === 'string' ? value : key;
}

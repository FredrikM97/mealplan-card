import en from './en.json';
import sv from './sv.json';
import ru from './ru.json';
import es from './es.json';

type Translation = Record<string, any>;
const translations = { en, sv, ru, es } satisfies Record<string, Translation>;
type Language = keyof typeof translations;

let currentLang: Language = 'en';

export function setLanguage(lang?: string) {
  const normalized = (lang ?? '').toLowerCase();
  const base = normalized.split('-')[0] ?? normalized;

  if (normalized in translations) {
    currentLang = normalized as Language;
  } else if (base in translations) {
    currentLang = base as Language;
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

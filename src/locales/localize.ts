import en from './en.json';
import sv from './sv.json';

type Translation = Record<string, any>;
const translations: Record<string, Translation> = { en, sv };

let currentLang = 'en';

export function setLanguage(lang: string) {
  if (translations?.[lang]) {
    currentLang = lang;
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

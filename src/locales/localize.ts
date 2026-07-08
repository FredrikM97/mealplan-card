type Translation = Record<string, unknown>;

// Dynamically load all locale JSON files
const translationModules = import.meta.glob<{ default: Translation }>(
  './*.json',
  { eager: true },
);

export const translations = Object.fromEntries(
  Object.entries(translationModules).map(([path, module]) => {
    const langCode = path.match(/\/(\w+)\.json$/)?.[1];
    return [langCode, module.default];
  }),
) as Record<string, Translation>;

type Language = keyof typeof translations;

const defaultLang: Language = 'en';

let currentLang: Language = defaultLang;

export function setLanguage(lang?: string) {
  if (!lang) {
    return;
  }

  const langCode = lang.toLowerCase();
  const baseLang = langCode.split('-')[0]!;

  if (langCode in translations) {
    currentLang = langCode as Language;
  } else if (baseLang in translations) {
    currentLang = baseLang as Language;
  }
}

/**
 * Resolve a nested path in an object (e.g., "config.sensor_label")
 */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, key) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, obj);
}

export function localize(key: string): string {
  const value =
    resolvePath(translations[currentLang], key) ??
    resolvePath(translations.en, key) ??
    key;
  return typeof value === 'string' ? value : key;
}

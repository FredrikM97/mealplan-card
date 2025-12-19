import en from './en.json';
import sv from './sv.json';

type Translation = Record<string, string | string[]>;
const translations: Record<string, Translation> = { en, sv };

let currentLang = 'en';

export function setLanguage(lang: string) {
  if (translations?.[lang]) {
    currentLang = lang;
  } else {
    currentLang = 'en';
  }
}

export function localize(key: string): string {
  const value =
    translations[currentLang]?.[key] ?? translations.en?.[key] ?? key;
  return typeof value === 'string' ? value : key;
}

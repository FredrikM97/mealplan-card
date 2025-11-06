import en from './en.json';
import sv from './sv.json';

const translations: Record<string, any> = { en, sv };

let currentLang = 'en';

export function setLanguage(lang: string) {
  if (translations?.[lang]) {
    currentLang = lang;
  } else {
    currentLang = 'en';
  }
}

export function localize(key: string): string {
  return (
    translations?.[currentLang]?.[key] || translations?.['en']?.[key] || key
  );
}

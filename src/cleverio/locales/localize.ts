import en from './en.json';
import sv from './sv.json';

const translations: Record<string, any> = { en, sv };

let currentLang = 'en';

export function setLanguage(lang: string) {
  currentLang = translations[lang] ? lang : 'en';
}

export function localize(key: string): any {
  return translations[currentLang]?.[key] || translations['en'][key] || key;
}
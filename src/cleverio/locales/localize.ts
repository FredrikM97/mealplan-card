let translations: { [key: string]: string } = {};
let loaded = false;

export async function loadTranslations() {
  if (loaded) return; // Only load once
  try {
    const url = new URL('./en.json', import.meta.url).href;
    const response = await fetch(url);
    if (response.ok) {
      translations = await response.json();
      loaded = true;
    } else {
      console.error('Failed to load translations', response.status);
    }
  } catch (e) {
    console.error('Failed to load translations', e);
  }
}

export function localize(key: string): string {
  return translations[key] || key;
}
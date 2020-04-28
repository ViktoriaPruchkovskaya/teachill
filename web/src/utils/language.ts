import i18next from 'i18next';

export function currentLanguage(): string {
  const language = i18next.language;
  return language.charAt(0).toUpperCase() + language.slice(1);
}

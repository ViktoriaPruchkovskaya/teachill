import { useTranslation } from 'react-i18next';

export function currentLanguage(): string {
  const { i18n } = useTranslation();
  const language = i18n.language;
  return language.charAt(0).toUpperCase() + language.slice(1);
}

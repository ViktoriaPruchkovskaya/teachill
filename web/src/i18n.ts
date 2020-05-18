import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as translationEN from './locales/en/translation.json';
import * as translationRU from './locales/ru/translation.json';

i18n.default
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    whitelist: ['en', 'ru'],
    resources: {
      en: {
        translation: translationEN,
      },
      ru: {
        translation: translationRU,
      },
    },
    load: 'languageOnly',
    fallbackLng: ['en'],
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator'],

      // keys or params to lookup language from
      lookupLocalStorage: 'language',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['localStorage'],

      // only detect languages that are in the whitelist
      checkWhitelist: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

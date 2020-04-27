import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as translationEN from './locales/en/translation.json';
import * as translationRU from './locales/ru/translation.json';

i18n.default.use(initReactI18next).init({
  whitelist: ['en', 'ru'],
  resources: {
    en: {
      translation: translationEN,
    },
    ru: {
      translation: translationRU,
    },
  },
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

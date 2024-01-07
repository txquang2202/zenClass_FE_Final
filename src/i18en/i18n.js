// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translations.json"; // Example English translations
import frTranslation from "./locales/fr/translations.json"; // Example French translations

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values by default
  },
});

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from './locales/fr.json'
import frYams from './locales/fr-yams.json'
import en from './locales/en.json'
import enYams from './locales/en-yams.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr, yams : frYams },
      en: { translation: en, yams : enYams  },
    },
    lng: navigator.language,
    fallbackLng: 'en',
    ns: ['translation', 'yams'],
    defaultNS: 'translation', 
    interpolation: { escapeValue: false },
  })

export default i18n

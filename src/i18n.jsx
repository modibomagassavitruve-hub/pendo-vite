import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations - International languages
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationAR from './locales/ar/translation.json';
import translationDE from './locales/de/translation.json';
import translationPT from './locales/pt/translation.json';

// African languages - West Africa
import translationWO from './locales/wo/translation.json';
import translationBM from './locales/bm/translation.json';
import translationYO from './locales/yo/translation.json';
import translationIG from './locales/ig/translation.json';
import translationHA from './locales/ha/translation.json';
import translationFF from './locales/ff/translation.json';
import translationFON from './locales/fon/translation.json';
import translationTW from './locales/tw/translation.json';
import translationEE from './locales/ee/translation.json';

// African languages - Central Africa
import translationLN from './locales/ln/translation.json';
import translationKG from './locales/kg/translation.json';
import translationSG from './locales/sg/translation.json';

// African languages - East Africa
import translationSW from './locales/sw/translation.json';
import translationAM from './locales/am/translation.json';

// African languages - Southern Africa
import translationAF from './locales/af/translation.json';
import translationZU from './locales/zu/translation.json';
import translationXH from './locales/xh/translation.json';
import translationSN from './locales/sn/translation.json';
import translationST from './locales/st/translation.json';
import translationTN from './locales/tn/translation.json';
import translationTS from './locales/ts/translation.json';
import translationND from './locales/nd/translation.json';
import translationSS from './locales/ss/translation.json';

// Define resources
const resources = {
  // International languages
  fr: { translation: translationFR },
  en: { translation: translationEN },
  es: { translation: translationES },
  ar: { translation: translationAR },
  de: { translation: translationDE },
  pt: { translation: translationPT },

  // West African languages
  wo: { translation: translationWO },
  bm: { translation: translationBM },
  yo: { translation: translationYO },
  ig: { translation: translationIG },
  ha: { translation: translationHA },
  ff: { translation: translationFF },
  fon: { translation: translationFON },
  tw: { translation: translationTW },
  ee: { translation: translationEE },

  // Central African languages
  ln: { translation: translationLN },
  kg: { translation: translationKG },
  sg: { translation: translationSG },

  // East African languages
  sw: { translation: translationSW },
  am: { translation: translationAM },

  // Southern African languages
  af: { translation: translationAF },
  zu: { translation: translationZU },
  xh: { translation: translationXH },
  sn: { translation: translationSN },
  st: { translation: translationST },
  tn: { translation: translationTN },
  ts: { translation: translationTS },
  nd: { translation: translationND },
  ss: { translation: translationSS },
};

// Language names for the selector
export const languages = {
  // International languages
  fr: { name: 'Français', nativeName: 'Français', flag: '🇫🇷', region: 'international' },
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'international' },
  es: { name: 'Español', nativeName: 'Español', flag: '🇪🇸', region: 'international' },
  ar: { name: 'العربية', nativeName: 'العربية', flag: '🇸🇦', rtl: true, region: 'international' },
  de: { name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', region: 'international' },
  pt: { name: 'Português', nativeName: 'Português', flag: '🇵🇹', region: 'international' },

  // West African languages
  wo: { name: 'Wolof', nativeName: 'Wolof', flag: '🇸🇳', region: 'west' },
  bm: { name: 'Bambara', nativeName: 'Bamanankan', flag: '🇲🇱', region: 'west' },
  yo: { name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'west' },
  ig: { name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', region: 'west' },
  ha: { name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', region: 'west' },
  ff: { name: 'Fulani', nativeName: 'Fulfulde', flag: '🇸🇳', region: 'west' },
  fon: { name: 'Fon', nativeName: 'Fongbe', flag: '🇧🇯', region: 'west' },
  tw: { name: 'Twi', nativeName: 'Twi', flag: '🇬🇭', region: 'west' },
  ee: { name: 'Ewe', nativeName: 'Eʋegbe', flag: '🇬🇭', region: 'west' },

  // Central African languages
  ln: { name: 'Lingala', nativeName: 'Lingála', flag: '🇨🇩', region: 'central' },
  kg: { name: 'Kikongo', nativeName: 'Kikongo', flag: '🇨🇩', region: 'central' },
  sg: { name: 'Sango', nativeName: 'Sängö', flag: '🇨🇫', region: 'central' },

  // East African languages
  sw: { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'east' },
  am: { name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'east' },

  // Southern African languages
  af: { name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'south' },
  zu: { name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'south' },
  xh: { name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', region: 'south' },
  sn: { name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', region: 'south' },
  st: { name: 'Sesotho', nativeName: 'Sesotho', flag: '🇱🇸', region: 'south' },
  tn: { name: 'Tswana', nativeName: 'Setswana', flag: '🇧🇼', region: 'south' },
  ts: { name: 'Tsonga', nativeName: 'Xitsonga', flag: '🇿🇦', region: 'south' },
  nd: { name: 'Ndebele', nativeName: 'isiNdebele', flag: '🇿🇦', region: 'south' },
  ss: { name: 'Swati', nativeName: 'siSwati', flag: '🇸🇿', region: 'south' },
};

i18n
  .use(LanguageDetector) // Détecte automatiquement la langue du navigateur
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut
    supportedLngs: Object.keys(languages),

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

// Handle RTL languages
i18n.on('languageChanged', (lng) => {
  const dir = languages[lng]?.rtl ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;


import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import EnTranslation from "./local/en";
import ArTranslation from "./local/ar";

const resources = {
  en: {
    translation: EnTranslation
  },
  ar: {
    translation: ArTranslation
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    interpolation: {
      escapeValue: false,
    },
    react:{
        useSuspend: false,
    }
  }); 

export default i18n;

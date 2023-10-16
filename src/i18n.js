
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ArTranslation from "./local/ar";
import EnTranslation from "./local/en";
import FrTranslation from "./local/fr";

const resources = {
  ar: {
    translation: ArTranslation
  },
  en: {
    translation: EnTranslation
  },
  fr: {
    translation: FrTranslation
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

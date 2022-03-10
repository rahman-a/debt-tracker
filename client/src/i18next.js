import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'
import englishTranslation from './localization/en/translation.json'
import arabicTranslation from './localization/ar/translation.json'
// import HttpApi from 'i18next-http-backend';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option 
    resources:{
        en:{
          translation:englishTranslation
        },
        ar:{
          translation:arabicTranslation
        }
    },
    fallbackLng:'en',
    detection:{
        order: ['localStorage','path', 'cookie',],
        caches: [ 'cookie', 'localStorage'],
    }
  });

  export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { DateTime } from "luxon";
i18n
  .use(Backend)
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: {
      order: ["navigator"],
    },
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: (value, format: any, lng) => {
        const date = DateTime as any;
        if (value instanceof Date) {
          return DateTime.fromJSDate(value)
            .setLocale(lng as string)
            .toLocaleString(date[format]);
        }
        return value;
      },
    },
  });

export default i18n;

import i18n from "i18next";

const languages: any = {
  en: "en",
  es: "es",
  pt: "pt-BR"
};

const languagesBackend: any = { ...languages, pt: "ptBR" };

const getLanguage = (languageObject: any) => {
  let language = "en";
  if (i18n.language) {
    for (let param in languageObject) {
      if (i18n.language.startsWith(param)) {
        language = languageObject[param];
        break;
      }
    }
  }
  return language;
};

export const getCurrentLanguage = () => getLanguage(languages);
export const getCurrentLanguageForBackend = () => getLanguage(languagesBackend);

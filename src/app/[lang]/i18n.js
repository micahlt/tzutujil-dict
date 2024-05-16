import "server-only";

const dictionaries = {
  en: () =>
    import("../locales/locale.en.json").then((module) => module.default),
  es: () =>
    import("../locales/locale.es.json").then((module) => module.default),
};

export const getDict = async (locale) => dictionaries[locale]();

import { I18n } from "i18n-js";
import translations from "../../public/translations.json";

const i18n = new I18n(translations);

const localLang = window.localStorage.getItem("locale");
if (!localLang) {
  window.localStorage.setItem("locale", "en");
} else if (localLang == "en") {
  i18n.locale = "en";
} else if (localLang == "es") {
  i18n.locale = "es";
}

const swapLang = () => {
  if (i18n.locale == "en") {
    i18n.locale = "es";
    window.localStorage.setItem("locale", "es");
  } else {
    i18n.locale = "en";
    window.localStorage.setItem("locale", "en");
  }
  location.reload();
};

export default i18n;
export { swapLang };

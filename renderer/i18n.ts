import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

type Locale = { locale: "en" | "es" };
const defaultLocale = "es";
const locales = ["es", "en"];
let hasInitiated = false;
function initLocale(locale: string) {
  if (hasInitiated) {
    return i18n;
  }
  hasInitiated = true;
  return i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, ns: string) =>
          import(`../locales/${language}/${ns}.json`)
      )
    )
    .init({
      fallbackLng: false,
      lng: locale || defaultLocale,
      debug: true,
      defaultNS: "common",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
}

function extractLocale(url: string) {
  const urlPaths = url.split("/");

  let locale;
  let urlWithoutLocale;
  // We remove the URL locale, for example `/de-DE/about` => `/about`
  const firstPath = urlPaths[1];
  if (
    locales.filter((locale) => locale !== defaultLocale).includes(firstPath)
  ) {
    locale = firstPath;
    urlWithoutLocale = "/" + urlPaths.slice(2).join("/");
  } else {
    locale = defaultLocale;
    urlWithoutLocale = url;
  }

  return { locale, urlWithoutLocale };
}

export { i18n, initLocale, defaultLocale, Locale, extractLocale, locales };

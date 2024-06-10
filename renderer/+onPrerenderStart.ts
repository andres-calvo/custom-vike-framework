// https://vike.dev/onPrerenderStart

import { OnPrerenderStartAsync, PageContextServer } from "vike/types";
import { locales, defaultLocale } from "./i18n";

// We only need this for pre-rendered apps https://vike.dev/pre-rendering
const onPrerenderStart: OnPrerenderStartAsync = async (
  prerenderContext
): ReturnType<OnPrerenderStartAsync> => {
  const pageContexts: Array<PageContextServer> = [];
  prerenderContext.pageContexts.forEach((pageContext) => {
    // Duplicate pageContext for each locale
    locales.forEach((locale) => {
      // Localize URL
      let { urlOriginal } = pageContext;
      if (locale !== defaultLocale) {
        urlOriginal = `/${locale}${pageContext.urlOriginal}`;
      }
      pageContexts.push({
        ...pageContext,
        urlOriginal,
        // Set pageContext.locale
        locale,
      });
    });
  });
  return {
    prerenderContext: {
      pageContexts,
    },
  };
};

export default onPrerenderStart;

export { getPageElement };

import React, { type ReactNode, Suspense } from "react";
import type { PageContext } from "vike/types";
import { PageContextProvider } from "../framework/hooks/usePageContext";
import { I18nextProvider } from "react-i18next";
import { i18n } from "./i18n";

function getPageElement(pageContext: PageContext): JSX.Element {
  // Main component
  const Layout = pageContext.config.Layout ?? PassThrough;
  const { Page } = pageContext;
  let page = <Layout>{Page ? <Page /> : null}</Layout>;

  // Wrapper components
  (pageContext.config.Wrapper || []).forEach((Wrapper) => {
    page = <Wrapper>{page}</Wrapper>;
  });
  page = (
    <PageContextProvider pageContext={pageContext}>{page}</PageContextProvider>
  );
  if (pageContext.config.reactStrictMode !== false) {
    page = <React.StrictMode>{page}</React.StrictMode>;
  }

  return (
    <Suspense>
      <I18nextProvider i18n={i18n}>{page}</I18nextProvider>
    </Suspense>
  );
}

function PassThrough({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

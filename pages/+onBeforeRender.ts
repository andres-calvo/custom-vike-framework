import { PageContext } from "vike/types";
import { initLocale } from "../renderer/i18n";

export async function onBeforeRender(pageContext: PageContext) {
  await initLocale(pageContext.locale);
  return { pageContext: {} };
}

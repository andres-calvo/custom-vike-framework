import React from "react";
import { usePageContext } from "../framework/hooks/usePageContext";
export { Link, ChangeLanguageLink };
import { defaultLocale } from "../renderer/i18n";
function Link(props: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const className = [
    props.className,
    pageContext.urlPathname === props.href && "is-active",
  ]
    .filter(Boolean)
    .join(" ");
  if (props.href) {
    const href =
      pageContext.locale == defaultLocale
        ? props.href
        : `/${pageContext.locale}${props.href}`;
    return <a {...props} href={href} className={className} />;
  } else {
    return <a {...props} className={className} />;
  }
}

function ChangeLanguageLink(props: {
  className: string;
  locale: "en" | "es";
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const className = [
    props.className,
    pageContext.locale === props.locale && "is-inactive",
  ]
    .filter(Boolean)
    .join(" ");
  const href =
    props.locale == defaultLocale
      ? pageContext.urlOriginal
      : `/${props.locale}${pageContext.urlOriginal}`;
  return (
    <a href={href} className={className}>
      {props.children}
    </a>
  );
}

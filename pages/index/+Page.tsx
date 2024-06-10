import React from "react";
import { Counter } from "./Counter.js";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation("common");
  return (
    <>
      <h1>My Vike app</h1>
      This page is:
      <ul>
        <li>{t("Hi")}</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}

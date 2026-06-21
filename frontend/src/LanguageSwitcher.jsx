/*
 * SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
 * SPDX-License-Identifier: MIT
 */
import React from "react";
import { useTranslation } from "react-i18next";
import { setLocale, SUPPORTED_LOCALES } from "./i18n/index.js";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="language-group" role="group" aria-label="Language">
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          className={i18n.language === locale ? "active" : ""}
          data-locale-choice={locale}
          onClick={(event) => {
            event.stopPropagation();
            setLocale(locale);
          }}
        >
          {locale === "en-US" ? t("common.languageEnglish") : t("common.languageChinese")}
        </button>
      ))}
    </div>
  );
}

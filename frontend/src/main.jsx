/*
 * SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
 * SPDX-License-Identifier: MIT
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n, { modelName, setLocale, readRuntimeConfig } from "./i18n/index.js";
import { LanguageSwitcher } from "./LanguageSwitcher.jsx";
import "../styles.css";

window.FreeSalesForecastI18n = {
  i18n,
  t: i18n.t.bind(i18n),
  setLocale,
  modelName,
  config: readRuntimeConfig(),
};

const languageRoot = document.querySelector("#languageSwitchMount");
if (languageRoot) {
  createRoot(languageRoot).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    </React.StrictMode>,
  );
}

import("../app.js");

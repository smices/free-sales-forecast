/*
 * SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
 * SPDX-License-Identifier: MIT
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.js";
import zhCN from "./locales/zh-CN.js";

export const SUPPORTED_LOCALES = ["en-US", "zh-CN"];
export const LOCALE_STORAGE_KEY = "freeSalesForecastLocale";

export function readRuntimeConfig() {
  return window.FREE_SALES_FORECAST_CONFIG || {};
}

function normalizeLocale(locale) {
  if (!locale || locale === "auto") return "";
  const lower = locale.toLowerCase();
  if (lower.startsWith("zh")) return "zh-CN";
  return "en-US";
}

export function detectLocale() {
  const queryLocale = normalizeLocale(new URLSearchParams(window.location.search).get("locale"));
  if (queryLocale) {
    localStorage.setItem(LOCALE_STORAGE_KEY, queryLocale);
    return queryLocale;
  }
  const stored = normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  if (stored) return stored;
  const configLocale = normalizeLocale(readRuntimeConfig().defaultLocale);
  if (configLocale) return configLocale;
  const browserLocale = normalizeLocale(navigator.language);
  return browserLocale || "en-US";
}

i18n.use(initReactI18next).init({
  resources: {
    "en-US": { translation: enUS },
    "zh-CN": { translation: zhCN },
  },
  lng: detectLocale(),
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
});

export function setLocale(locale) {
  const normalized = normalizeLocale(locale) || "en-US";
  localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
  return i18n.changeLanguage(normalized).then(() => {
    window.dispatchEvent(new CustomEvent("free-sales-forecast:locale-changed", { detail: { locale: normalized } }));
  });
}

export function modelName(modelId) {
  return i18n.t(`model.${modelId}`, { defaultValue: modelId || "-" });
}

export default i18n;

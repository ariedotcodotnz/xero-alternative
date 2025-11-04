import { I18n as I18nJS } from "i18n-js";
import { hnryLocales } from "../types/jurisdictions.type";

import en from "../locales/en.json";
import enAU from "../locales/en-AU.json";
import enGB from "../locales/en-GB.json";
import enNZ from "../locales/en-NZ.json";

const I18n = new I18nJS();

I18n.store(en);
I18n.defaultLocale = "en";
I18n.enableFallback = true;

I18n.missingTranslation.register("notify", (i18n, thescope) => {
  let scope = thescope;
  if (window.Rollbar && Rollbar.warning) {
    Rollbar.warning(
        `Missing translation for ${scope} using ${i18n.locale} locale.`,
    );
  }

  if (scope instanceof Array) {
    scope = scope.join(i18n.defaultSeparator);
  }

  // Get only the last portion of the scope.
  // Replace underscore with space and camelcase with space and lowercase letter.
  let message = scope.split(i18n.defaultSeparator).slice(-1)[0];
  message = message
      .replace("_", " ")
      .replace(
          /([a-z])([A-Z])/g,
          (_match: string, p1: string, p2: string) => `${p1} ${p2.toLowerCase()}`,
      );

  if (navigator.webdriver) {
    message = `[[[MISSING TRANSLATION]]] ${message}`;
  }

  return message;
});

I18n.missingBehavior = "notify";

export const storeRequiredLocales = (forceLocale?: hnryLocales) => {
  const locale = forceLocale || window.Hnry?.User?.jurisdiction?.locale || "en";

  if (I18n.locale === locale) return;

  switch (locale) {
    case "en-AU":
      I18n.store(enAU);
      break;
    case "en-GB":
      I18n.store(enGB);
      break;
    case "en-NZ":
      I18n.store(enNZ);
      break;
    default:
      break;
  }

  I18n.locale = locale;
};

storeRequiredLocales();

document.addEventListener("turbolinks:before-render", () =>
    storeRequiredLocales(),
);

export default I18n;

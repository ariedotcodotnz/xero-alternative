import hnryJurisdictions from "../../types/jurisdictions.type";
import { acceptedCurrencyLocaleTypes, acceptedCurrencyValues, currencyDisplayType } from "../../types/currency.type";
import jurisdictionValues from "./currency_jurisdiction_values";

/**
 *
 */
export const formatToLocalCurrency = (
  value: number,
  jurisdiction: hnryJurisdictions,
  options?: {
    currency?: acceptedCurrencyValues,
    locale?: acceptedCurrencyLocaleTypes,
    currencyDisplay?: currencyDisplayType,
    decimals?: boolean
  },
  hideSymbol = false
) => {
  if (typeof value === "string") {
    throw new Error("value cannot be a string, bring me a number OR ELSE...");
  }
  const localizedCurrencyToUse = jurisdictionValues[jurisdiction];
  const currencyValue = options?.currency || localizedCurrencyToUse.currencyValue;
  const localeToUse = options?.locale || localizedCurrencyToUse.locale;

  if (hideSymbol) {
    const formatter = {
      minimumFractionDigits: 2,
    };
    return new Intl.NumberFormat(localeToUse, formatter).format(value);
  }

  if (options?.decimals) {
    const formatter: Intl.NumberFormatOptions = {
      style: "currency" as const,
      currency: currencyValue,
      currencyDisplay: options?.currencyDisplay,
      minimumFractionDigits: 2,
    };
    return new Intl.NumberFormat(localeToUse, formatter).format(value);
  }
  const fraction = {
    style: "currency" as const,
    currency: currencyValue,
    currencyDisplay: options?.currencyDisplay,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  return new Intl.NumberFormat(localeToUse, fraction).format(value);
};

export default formatToLocalCurrency;

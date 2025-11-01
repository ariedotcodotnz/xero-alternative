import hnryJurisdictions from "../../types/jurisdictions.type";
import { acceptedCurrencyLocaleTypes, acceptedCurrencyValues } from "../../types/currency.type";

interface jurisdictionCurrencyOptions {
    locale: acceptedCurrencyLocaleTypes,
    currencyValue: acceptedCurrencyValues
}

export const jurisdictionValues:Record<hnryJurisdictions, jurisdictionCurrencyOptions> = {
  au: { locale: "en-AU", currencyValue: "AUD" },
  nz: { locale: "en-NZ", currencyValue: "NZD" },
  uk: { locale: "en-GB", currencyValue: "GBP" },
};

export default jurisdictionValues;

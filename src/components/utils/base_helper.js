import round from "lodash/round";
import camelCase from "lodash/camelCase";
import mapKeys from "lodash/mapKeys";

export const colours = {
  green: {
    base: "#33B082",
    light: "#4bcb9c",
  },
  blue: {
    base: "#242659",
    light: "#33367D",
  },
  lightBlue: {
    base: "#777798",
    light: "#777798",
  },
  grey: {
    dark: "#767676",
    light: "#C8CBCB",
    superlight: "#EDF0F2",
  },
  orange: {
    base: "#F07F38",
  },
};

// eslint-disable-next-line xss/no-mixed-html
export const inlineLoader = "<div class='lds-ellipsis' aria-hidden='true'><div></div><div></div><div></div><div></div></div>";

export function formatCurrency(amount, {
  code, symbol, symbol_first, include_code, decimal_places,
}) {
  let absoluteAmount = amount;
  let prefix = "";
  if (amount < 0) {
    absoluteAmount = amount * -1;
    prefix = "-";
  }
  const localisedAmount = toLocaleString(absoluteAmount, decimal_places);

  if (include_code) {
    if (symbol_first) {
      return `${prefix}${symbol}${localisedAmount} ${code}`;
    }
    return `${prefix}${localisedAmount} ${code}`;
  } if (symbol_first) {
    return `${prefix}${symbol}${localisedAmount}`;
  }
  return `${prefix}${localisedAmount} ${symbol}`;
}

export function toLocaleString(n, decimalPlaces) {
  decimalPlaces = (typeof decimalPlaces !== "undefined") ? decimalPlaces : 2;
  return parseFloat(n).toLocaleString(undefined, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
}

export function round2Dp(n) {
  return round(round(n, 4), 2);
}

export function listNumbers(lowEnd, highEnd) {
  const list = [];
  for (let i = lowEnd; i <= highEnd; i++) {
    list.push(i);
  }
  return list;
}

export function roundCurrencyAmount(amount, currencySymbol = "$") {
  const rawValue = amount.replace(new RegExp(`[\,\\${currencySymbol}]`, "g"), "");
  if (!rawValue) {
    return (0.0).toFixed(2);
  }
  const asNumber = Number(rawValue);
  if (asNumber.toFixed(2) === asNumber.toString()) {
    return asNumber;
  }
  return asNumber.toFixed(2);
}

export function errorHandling(errors, textStatus, errorThrown) {
  const err = errors.responseJSON;
  for (const i in err) {
    const line = err[i];
    toastr.error(line);
  }
}

export function toRegexSafe(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isIE() {
  return !document.body.scrollTo || window.navigator.userAgent.indexOf("Trident/") > -1
    || window.navigator.userAgent.indexOf("MSIE") > -1;
}

export function formattedDateWithMonthName(date) {
  return new Date(date).toLocaleString("default", { day: "2-digit", month: "short", year: "numeric" });
}

export const truncate = (line, width) => (line.length <= width ? line : line.slice(0, width).concat("..."));

export const removeButtonPopOver = () => {
  const popover = document.querySelector(".popover");

  if (popover) {
    popover.remove();
  }
};

export const camelizeKeys = (object) => mapKeys(object, (_, k) => camelCase(k));

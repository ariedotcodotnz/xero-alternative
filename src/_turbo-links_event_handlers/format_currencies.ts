import hnryJurisdictions from "../types/jurisdictions.type";
import convertElementInputToCurrency from "../utilities/currency/convert_element_input_to_currency";
import bindCurrencyFormatEvents from "./bind_event_listener";
import debounce from "../utilities/debounce";

const onInput = (e) => {
  const jurisdiction = e.currentTarget.dataset?.jsFormatCurrency as hnryJurisdictions;
  convertElementInputToCurrency(e.currentTarget, e.type, jurisdiction);
};

const onDomChange = () => {
  bindCurrencyFormatEvents("[data-js-format-currency]", onInput, "blur");
};

const bindDomChangeEvents = () => {
  const observer = new MutationObserver(debounce(onDomChange, 300));
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
};

const onLoad = () => {
  bindCurrencyFormatEvents("[data-js-format-currency]", onInput, "blur");
  bindDomChangeEvents();
};

const bindTurboLink = () => {
  document.addEventListener("turbolinks:load", onLoad);
};

bindDomChangeEvents();
bindTurboLink();

export { bindDomChangeEvents, bindTurboLink };

import hnryJurisdictions from "../types/jurisdictions.type";
import convertElementInputToCurrency from "../utilities/currency/convert_element_input_to_currency";
import bindEventListener from "./bind_event_listener";
import debounce from "../utilities/debounce";

const onInput = (e) => {
  const jurisdiction = e.currentTarget.dataset?.jsFormatCurrencyNoSymbol as hnryJurisdictions;
  convertElementInputToCurrency(e.currentTarget, "blur", jurisdiction, true);
};

const onDomChange = () => {
  bindEventListener("[data-js-format-currency-no-symbol]", onInput, "blur")
};

const bindNoSymbolCurrencyDomChangeEvents = () => {
  const observer = new MutationObserver(debounce(onDomChange, 300));
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
};

const formatElementOnLoad = () => {
  const elementsToTrack = Array.from(document.querySelectorAll("[data-js-format-currency-no-symbol]"));
  elementsToTrack.forEach((element: HTMLInputElement) => {
    const jurisdiction = element.dataset?.jsFormatCurrencyNoSymbol as hnryJurisdictions;
    convertElementInputToCurrency(element, "blur", jurisdiction, true);
  });
};

const onLoad = () => {
  bindEventListener("[data-js-format-currency-no-symbol]", onInput, "blur")
  bindNoSymbolCurrencyDomChangeEvents();
  formatElementOnLoad();
};

const bindNoSymbolCurrencyTurboLink = () => {
  document.addEventListener("turbolinks:load", onLoad);
};

bindNoSymbolCurrencyDomChangeEvents();
bindNoSymbolCurrencyTurboLink();

export { bindNoSymbolCurrencyDomChangeEvents, bindNoSymbolCurrencyTurboLink };

// Binds listeners to elements with a specific attribute name, selectorAttrName, to run a function, inputFn, on event type, type.
// If you're wanting to use this, make sure you add the attribute name to the type or Typescript with give you angry red wiggles.

export type selectorDataAttrName = "[data-js-format-currency-no-symbol]" | 
"[data-js-format-currency]" | 
"[data-js-self-employed-income-estimate-average]" | 
"[data-js-has-default-self-employed-income]" |
"[data-js-self-employed-income-amount]" |
"[data-js-salary-income-amount]" |
"[data-js-other-income-amount]"

const bindEventListener = (selectorAttrName: selectorDataAttrName, inputFn: (e: Event) => void, type: keyof HTMLElementEventMap) => {
  Array.from(document.querySelectorAll(selectorAttrName))?.forEach((element: HTMLInputElement) => {
    element.removeEventListener(type, inputFn);
    element.addEventListener(type, inputFn);
  });
};

export default bindEventListener

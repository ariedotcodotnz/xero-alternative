/* eslint-disable xss/no-mixed-html */
import convertElementInputToCurrency from "../utilities/currency/convert_element_input_to_currency";
import debounce from "../utilities/debounce";
import bindEventListener from "./bind_event_listener";

let currEstVal;

const getNumberFromCurrencyString = (stringVal): number => {
    const updatedVal = stringVal.replace(/[$,]/g, "")
    return parseFloat(updatedVal)
}

const onInput = (e) => {
    const values = e.currentTarget.dataset?.jsSelfEmployedIncomeEstimateAverage.split(",")
    const jurisdiction = values[0]?.trim();
    const type = values[1]?.trim();

    const estimateField = document.getElementById("self-employed-income-estimate-amount") as HTMLInputElement
    
    if (estimateField?.value) {
        currEstVal = estimateField.value;
    }



    const nextBtn = document.getElementById("tour-next-btn") as HTMLButtonElement;


    userClickedYes(estimateField, currEstVal, jurisdiction)
    if (type === "estimate") {
        
        disableButton(nextBtn)
        const { value } = e.currentTarget
        currEstVal = value
        if (getNumberFromCurrencyString(value) > 0) {
            enableButton(nextBtn);
        }
    }

    // ensure value is in correct format
    convertElementInputToCurrency(e.currentTarget, "blur", jurisdiction);
  };


const enableButton = (btn: HTMLButtonElement) => {
    if (btn.hasAttribute("disabled")) {
        btn.removeAttribute("disabled");
    }
}

const disableButton = (btn: HTMLButtonElement) => {
    btn.setAttribute("disabled", "true")
}

const userClickedYes = (e, currentValue, jurisdiction) => {
    document.getElementById("self_employed_income_estimate_estimate").addEventListener("click", () => {
        e.value = currentValue
        convertElementInputToCurrency(e, "blur", jurisdiction);
});
}

 
const eventsBound = ["click", "blur", "mouseenter", "mouseleave"]

const bindEvents = () => {
    eventsBound.forEach(event => { 
        bindEventListener("[data-js-self-employed-income-estimate-average]", onInput, event as keyof HTMLElementEventMap)
    })      
};
  
const bindIncomeEstimateEventsDomChangeEvents = () => {
    const observer = new MutationObserver(debounce(bindEvents, 300));
    observer.observe(document, { attributes: true, childList: true, subtree: true });
};


const bindIncomeEstimateEvents = () => {
    document.addEventListener("turbolinks:load", bindEvents);
};

bindIncomeEstimateEvents();
bindIncomeEstimateEventsDomChangeEvents();

export  { bindIncomeEstimateEvents, bindIncomeEstimateEventsDomChangeEvents }
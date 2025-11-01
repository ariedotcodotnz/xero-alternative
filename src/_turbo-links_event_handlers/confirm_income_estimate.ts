/* eslint-disable xss/no-mixed-html */
import debounce from "../utilities/debounce";
import bindEventListener, { selectorDataAttrName } from "./bind_event_listener";
import I18n from "../utilities/translations";
import updateIncomeForecastRates from "../utilities/income_forecast_rates";

let originalEstimate;

const executedUpdateIncomeForecastRates = debounce(updateIncomeForecastRates, 100);

const onInput = (e) => {
  const selfEmployedIncomeSection = document.getElementById("self-employed-income-section") as HTMLInputElement;
  const confirmPageTotalIncomeSection = document.getElementById("confirm-page-total-income-section") as HTMLInputElement;
  const selfEmployedIncomeAlertSection = document.getElementById("self-employed-income-alert-section") as HTMLInputElement;
  const selfEmployedIncomeAmount = document.getElementById("user_income_estimate_attributes_self_employed_income") as HTMLInputElement;
  const selfEmployedIncomeField = document.getElementById("self-employed-income-amount") as HTMLInputElement;
  const incomeEstimateMessageSection = document.getElementById("income-estimate-message-section") as HTMLInputElement;
  const hasDefaultSelfEmployedIncome = e.currentTarget.checked;

  selfEmployedIncomeSection.hidden = hasDefaultSelfEmployedIncome;
  confirmPageTotalIncomeSection.hidden = hasDefaultSelfEmployedIncome;
  selfEmployedIncomeAlertSection.hidden = !hasDefaultSelfEmployedIncome;
  if (hasDefaultSelfEmployedIncome) {
    incomeEstimateMessageSection.innerHTML = I18n.t("onboarding_tour.confirm_your_income.income_tax_message_average");
    selfEmployedIncomeAmount.value = originalEstimate;
    selfEmployedIncomeField.value = originalEstimate;
    selfEmployedIncomeField.required = false;
  }
  else {
    incomeEstimateMessageSection.innerHTML = I18n.t("onboarding_tour.confirm_your_income.income_tax_message_estimate");
    if (!originalEstimate) {
      originalEstimate = selfEmployedIncomeAmount.value;
    }
    selfEmployedIncomeAmount.value = "0";
    selfEmployedIncomeField.value = "";
    selfEmployedIncomeField.required = true;
  }
  updateIncomeForecastRates();
}

const bindConfirmIncomeEstimateEventsDomChangeEvents = () => {
  const observer = new MutationObserver(debounce(bindEvents, 300));
  observer.observe(document, { attributes: true, childList: true, subtree: true });
};

const bindEvents = () => {
  bindEventListener("[data-js-has-default-self-employed-income]", onInput, "click");
  ["[data-js-self-employed-income-amount]", "[data-js-salary-income-amount]", "[data-js-other-income-amount]"].forEach((selectorAttrName: selectorDataAttrName) =>{
    bindEventListener(selectorAttrName, executedUpdateIncomeForecastRates, "keyup");
  });
};

const bindConfirmIncomeEstimateEvents = () => {
  document.addEventListener("turbolinks:load", bindEvents);
};

bindConfirmIncomeEstimateEvents();
bindConfirmIncomeEstimateEventsDomChangeEvents();

export { bindConfirmIncomeEstimateEvents, bindConfirmIncomeEstimateEventsDomChangeEvents, updateIncomeForecastRates }
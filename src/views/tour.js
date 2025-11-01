import isValidInputNumber from "../es_utilities/isValidInputNumber"
import I18n from "../utilities/translations";

$(document).on("change", "#prior-expenses-this-year-dropdown", function (event) {
  const { value } = event.target;
  togglePriorExpensesThisYearFeedback(value);
});


document.addEventListener("change", () => {
  const selectEl = document.getElementById("accountant-arrangement-dropdown-select")
  if(selectEl) {
    selectEl.onchange = () =>  {
      toggleAccountantArrangementFeedback(selectEl.value);
    } 
  }
})

document.addEventListener("change", (event) => {
  
  const { target } = event;
  const { id, value, dataset } = target;
  if (id === "job-category" && value) {
    showJobTypeFeedback();
  } else if (dataset.feedbackid === "document-type") {
    toggleDocumentTypeFeedback(dataset.text);
  }
});

const showJobTypeFeedback = () => {
  const feedback = document.querySelector("#job-type-feedback");
  if (feedback && feedback.classList.contains("hidden")) {
    feedback.classList.remove("hidden");
    feedback.setAttribute("aria-live", "polite");
  }
};

const toggleDocumentTypeFeedback = (selectedValue) => {
  const feedback = document.querySelector("#document-type-upload");
  if (selectedValue === "other") {
    hideElement(feedback);
    ReactRailsUJS.unmountComponents("#document-type-upload");
  } else {
    showElement(feedback);
    ReactRailsUJS.mountComponents("#document-type-upload");
  }
};

const togglePriorExpensesThisYearFeedback = (selectedValue) => {
  const feedbackIds = ["no-expenses-feedback", "accountant-feedback", "manual-feedback"];
  const feedbackIdsForDropdownValues = {
    no_expenses: "#no-expenses-feedback",
    accountant: "#accountant-feedback",
    manual: "#manual-feedback",
  };
  feedbackIds.forEach((feedbackId) => {
    const feedback = document.getElementById(feedbackId);
    hideElement(feedback);
  });

  const feedbackId = feedbackIdsForDropdownValues[selectedValue];
  const feedback = document.querySelector(feedbackId);
  showElement(feedback);
};

const toggleAccountantArrangementFeedback = (selectedValue) => {
  const feedbackIdsForDropdownValues = {
    hnry: "hnry-feedback", 
    accountant_remaining_fy: "accountant-remaining-fy-feedback", 
    hnry_with_accountant: "hnry-with-accountant-feedback", 
    unsure: "unsure-feedback"
  };

  Object.values(feedbackIdsForDropdownValues).forEach((feedbackId) => {
    const feedback = document.getElementById(feedbackId);
    hideElement(feedback);
  });

  const feedbackId = feedbackIdsForDropdownValues[selectedValue];
  const feedback = document.getElementById(feedbackId);
  showElement(feedback);
}

const validateSelfEmployedIncome = (event) => {
  const { classList } = event.target;

  const hiddenFieldValue = document.getElementById("user_income_estimate_attributes_self_employed_income").value;

  if (parseFloat(hiddenFieldValue) <= 0) {
    classList.add("is-invalid", "mb-0");
  } else {
    classList.remove("is-invalid", "mb-0");
  }
};

document.addEventListener("change", () => {
  // self-employed-income-estimate-amount
  const selfEmployedIncomeToValidate = document.querySelectorAll("#self-employed-income-amount, #self-employed-income-estimate-amount")
  // const selfEmployedIncome = document.getElementById("self-employed-income-amount");
  if (selfEmployedIncomeToValidate) {
    selfEmployedIncomeToValidate.forEach(e => {
      e.addEventListener("focusout", event => {
        validateSelfEmployedIncome(event);
      })
    })
  }
});

const validateUniqueTaxpayerReference = ({ target }) => {
  if (target.id !== "tour-utr-number") {
    return;
  }

  const invalidFeedback = document.querySelector("#self-assessment-registration-feedback .invalid-feedback")

  if (isValidInputNumber({ value: target.value, regex: I18n.t("validation_regex.utr_number"), canBeEmpty: true })) {
    invalidFeedback.classList.remove("d-block");
    target.classList.remove("is-invalid", "mb-0");
  } else {
    invalidFeedback.classList.add("d-block");
    target.classList.add("is-invalid", "mb-0");
  }
};

document.addEventListener("change", (event) => validateUniqueTaxpayerReference(event));

const validateVATNumber = ({ target }) => {
  if (target.id !== "tour-vat-number") {
    return;
  }

  const nextButton = document.querySelector("#tour-next-btn");
  const invalidFeedback = document.querySelector("#sales-tax-registered-feedback .invalid-feedback");

  if (isValidInputNumber({ value: target.value, regex: I18n.t("validation_regex.vat_number"), canBeEmpty: true })) {
    nextButton.disabled = false;
    invalidFeedback.classList.remove("d-block");
    target.classList.remove("is-invalid", "mb-0");
  } else {
    nextButton.disabled = true;
    invalidFeedback.classList.add("d-block");
    target.classList.add("is-invalid", "mb-0");
  }
};

document.addEventListener("change", (event) => validateVATNumber(event));

const clearVATValidationState = ({ target }) => {
  if (target.dataset.feedbackid !== "sales-tax-registered" || document.querySelector("#tour-vat-number") === null) {
    return;
  }

  const nextButton = document.querySelector("#tour-next-btn");
  const vatInput = document.querySelector("#tour-vat-number");
  const invalidFeedback = document.querySelector("#sales-tax-registered-feedback .invalid-feedback");

  nextButton.disabled = false;
  vatInput.classList.remove("is-invalid", "mb-0");
  invalidFeedback.classList.remove("d-block");
};

document.addEventListener("change", event => clearVATValidationState(event));

const setVisibleAllocationRate = (rate) => {
  const allocationRate = document.querySelector("#tour-card-allocation-rate");
  if (allocationRate) {
    allocationRate.textContent = rate
  }
};

const setAllocationRateToSubmit = (rate) => {
  const hiddenAllocationRate = document.querySelector("#user_profile_signup_card_allocation_preference_percentage");
  const allocationRateNumber = rate[0]
  if (hiddenAllocationRate) {
    hiddenAllocationRate.value = allocationRateNumber.toString()
  }
};

const handleCardExpenseAllocationRate = ({detail}) => {
  setVisibleAllocationRate(detail)
  setAllocationRateToSubmit(detail)
}

document.addEventListener("onboarding_card_allocation_rate_slider_event", event => handleCardExpenseAllocationRate(event))

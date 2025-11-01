import { checkBankValidation, iBankAccountValidation } from "../API/bank_account_validation.api";
import { toggleNextBtnDisabled } from "./form/disable_rails_form_button";
import updateIncomeForecastRates from "./income_forecast_rates";

const INVALID = "invalid";
const VALID = "valid";

const NZ_BANK_ACCOUNT_NUMBER_ID_SELECTOR = "bank-account-number";
const BANK_BRANCH_CODE_ID_SELECTOR = "bank-account-bank-branch-code";
const ACCOUNT_NUMBER_ID_SELECTOR = "bank-account-account-number";

const NZ_BANK_ACCOUNT_NUMBER_INPUT_SELECTOR = "#user_financial_attributes_bank_account_number";
const BANK_BRANCH_CODE_INPUT_SELECTOR = "#user_financial_attributes_bank_account_number_bank_branch_code";
const ACCOUNT_NUMBER_INPUT_SELECTOR = "#user_financial_attributes_bank_account_number_account_number";

const TOUR_NEXT_BUTTON = "tour-next-btn";

/**
 * Make various class and attribute changes to show or indicators if a field is valid.
 *
 * @param bankAccountFieldSelector string fragment to identify icon images
 * @param bankAccountFieldInputSelector input field id selector
 * @param isValid true if the field value is valid
 */
function toggleBankAccountValidity(bankAccountFieldSelector: string, bankAccountFieldInputSelector: string, isValid: boolean) {
  const addClass = isValid ? VALID : INVALID;
  const removeClass = isValid ? INVALID : VALID;
  const bankAccountFieldFeedbackSelector = `#${bankAccountFieldSelector}-feedback`;

  // icon
  $(`.${bankAccountFieldSelector}-icon`).addClass("hidden");
  $(`#${bankAccountFieldSelector}-${addClass}-icon`).removeClass("hidden");

  // field
  $(bankAccountFieldInputSelector).removeClass(removeClass);
  $(bankAccountFieldInputSelector).addClass(addClass);
  $(bankAccountFieldInputSelector).attr("valid", isValid.toString());

  // feedback
  if (isValid) {
    $(bankAccountFieldFeedbackSelector).addClass("hidden");
  } else {
    $(bankAccountFieldFeedbackSelector).removeClass("hidden");
  }
}

/**
 * Clear all indications if a field is valid or not
 * 
 * @param bankAccountFieldSelector  string fragment to identify icon images
 * @param bankAccountFieldInputSelector input field id selector
 */
function clearBankAccountValidity(bankAccountFieldSelector: string, bankAccountFieldInputSelector: string) {
  const bankAccountFieldFeedbackSelector = `#${bankAccountFieldSelector}-feedback`;
  $(`.${bankAccountFieldSelector}-icon`).addClass("hidden");
  $(bankAccountFieldInputSelector).removeClass(`${INVALID} ${VALID}`);
  $(bankAccountFieldInputSelector).removeAttr("valid");
  $(bankAccountFieldFeedbackSelector).addClass("hidden");
}

async function isBankBranchCodeValid(body: iBankAccountValidation) {
  const { bank_branch_code } = await checkBankValidation(body);
  return bank_branch_code.valid;
}

async function isAccountNumberValid(body: iBankAccountValidation) {
  const { account_number } = await checkBankValidation(body);
  return account_number.valid;
}

/**
 * Validate the Bank and Branch section of the Bank Account Number (BSB in AU, Sort Code in UK etc)
 */
async function validateBankBranchCode() {
  // eslint-disable-next-line xss/no-mixed-html
  const bankBranchField = <HTMLInputElement>document.querySelector(BANK_BRANCH_CODE_INPUT_SELECTOR);
  // eslint-disable-next-line xss/no-mixed-html
  const accountField = <HTMLInputElement>document.querySelector(ACCOUNT_NUMBER_INPUT_SELECTOR);
  if (bankBranchField.value === "") {
    clearBankAccountValidity(BANK_BRANCH_CODE_ID_SELECTOR, bankBranchField.id);
    return;
  }
  const body = {
    bank_branch_code: bankBranchField.value.replaceAll("-", ""),
    account_number: accountField.value,
  };

  const isValid = await isBankBranchCodeValid(body)
  toggleBankAccountValidity(BANK_BRANCH_CODE_ID_SELECTOR, BANK_BRANCH_CODE_INPUT_SELECTOR, isValid);
  toggleNextBtnDisabled(!isValid, TOUR_NEXT_BUTTON);
}

/**
 * Validate the Account Number section of the Bank Account Number
 */
async function validateAccountNumber() {
  // eslint-disable-next-line xss/no-mixed-html
  const bankBranchField = <HTMLInputElement>document.querySelector(BANK_BRANCH_CODE_INPUT_SELECTOR);
  // eslint-disable-next-line xss/no-mixed-html
  const accountField = <HTMLInputElement>document.querySelector(ACCOUNT_NUMBER_INPUT_SELECTOR);
  if (accountField.value === "") {
    clearBankAccountValidity(ACCOUNT_NUMBER_ID_SELECTOR, ACCOUNT_NUMBER_INPUT_SELECTOR);
    return;
  }
  const body = {
    bank_branch_code: bankBranchField.value.replace("-", ""),
    account_number: accountField.value,
  };

  const isValid = await isAccountNumberValid(body);
  toggleBankAccountValidity(ACCOUNT_NUMBER_ID_SELECTOR, ACCOUNT_NUMBER_INPUT_SELECTOR, isValid);
  toggleNextBtnDisabled(!isValid, TOUR_NEXT_BUTTON);
}

/**
 * Validate an NZ Bank Account Number (this is entered as one number in the form)
 */
async function validateNzBankAccountNumber() {
  // eslint-disable-next-line xss/no-mixed-html
  const accountField = <HTMLInputElement>document.querySelector(NZ_BANK_ACCOUNT_NUMBER_INPUT_SELECTOR);
  if (accountField.value === "") {
    clearBankAccountValidity(NZ_BANK_ACCOUNT_NUMBER_ID_SELECTOR, ACCOUNT_NUMBER_INPUT_SELECTOR);
    return;
  }
  const body = {
    account_number: accountField.value,
  };

  const isValid = await isAccountNumberValid(body);
  toggleBankAccountValidity(NZ_BANK_ACCOUNT_NUMBER_ID_SELECTOR, ACCOUNT_NUMBER_INPUT_SELECTOR, isValid);
  toggleNextBtnDisabled(!isValid, TOUR_NEXT_BUTTON);
}

/**
 * Invoke validation based on any field with a value
 */
function validateBankAccountNumber() {
  updateIncomeForecastRates();

  if ($(NZ_BANK_ACCOUNT_NUMBER_INPUT_SELECTOR).length > 0) {
    validateNzBankAccountNumber();
  }

  if ($(BANK_BRANCH_CODE_INPUT_SELECTOR).length > 0) {
    validateBankBranchCode();
  }

  if ($(ACCOUNT_NUMBER_INPUT_SELECTOR).length > 0) {
    validateAccountNumber();
  }
}

// Listen for a modal show event or a modal next event to validate bank account number
// i.e: validate NZ bank account number
$(document).on("shown.bs.modal", validateBankAccountNumber);

$(document).on("next.bs.modal", validateBankAccountNumber);

// Change events for various Bank Account Input fields
$(document).on("change", NZ_BANK_ACCOUNT_NUMBER_INPUT_SELECTOR, validateNzBankAccountNumber);

$(document).on("change", BANK_BRANCH_CODE_INPUT_SELECTOR, validateBankBranchCode);

$(document).on("change", ACCOUNT_NUMBER_INPUT_SELECTOR, validateAccountNumber);

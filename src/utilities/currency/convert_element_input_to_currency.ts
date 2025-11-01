import hnryJurisdictions from "../../types/jurisdictions.type";
import cleanValueToJustNumbers from "../base_logic/cleanValueToNumbers";
import convertStringToNumber from "../base_logic/convertStringToNumber";
import { specialCharRegexGlobal } from "../base_logic/globalRegexValues";
import replaceAt from "../base_logic/replaceAt";
import setCaretPosition from "../base_logic/setCaretPosition";
import formatToLocalCurrency from "./currency_format";

function updateHiddenInput(input: HTMLInputElement, amount: string) {
  const inputIdValue = input.dataset.inputId;
  // eslint-disable-next-line xss/no-mixed-html
  const hiddenInput = <HTMLInputElement>document.getElementById(inputIdValue);
  input.value = amount;

  if (hiddenInput) {
    hiddenInput.value = cleanValueToJustNumbers(amount);

    if (hiddenInput.dataset.dispatchInputEvent) {
      // Sometimes we will have downstream listeners watching for changes to the
      // value of this field
      hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
}

const convertElementInputToCurrency = (element: HTMLInputElement, type: "keyup" | "blur", jurisdiction: hnryJurisdictions, hideSymbol = false) => {
  // step 1, get current value and caret position and store as consts

  const startingValue = element.value;

  if (startingValue) {
    // get current value of special characters for use in placing the caret later
    const startingSpecialCharacterCount = startingValue.match(specialCharRegexGlobal);

    // get starting caret position as a reference
    const startingCaretPosition = element.selectionStart;

    // step 2 clean string to just be numerical values, removes all special chars outside of the decimals

    let cleanedVal = cleanValueToJustNumbers(startingValue);

    // step 3, ensure there is only one decimal place

    if (cleanedVal.indexOf(".") !== cleanedVal.lastIndexOf(".")) {
      cleanedVal = replaceAt(cleanedVal, cleanedVal.indexOf("."), "");
    }

    // convert string to number
    const numberFormat = convertStringToNumber(cleanedVal);

    // check to see if its still a number, if its not, get out and return 0
    if (Number.isNaN(numberFormat)) {
      element.value = formatToLocalCurrency(0, jurisdiction, { decimals: true });
      element.value = null;
      return;
    }

    // check if decimal place exists or user is bluring away from field for what formatting should be applied
    const isDecimalPlace = cleanedVal.indexOf(".") !== -1 || type === "blur";

    // format number to local currency
    const formattedNumber = formatToLocalCurrency(numberFormat, jurisdiction, { decimals: isDecimalPlace }, hideSymbol);

    // get special characters from formatted number to compare to original nubmer of special chars when placing the caret backs
    const allFoundCharacters = formattedNumber.match(specialCharRegexGlobal);

    // apply value to element
    element.value = formattedNumber;

    // get length of special chars to avoid accidentally blowing things up by ensuring this is a number
    const allFoundNumber = allFoundCharacters?.length ?? 0;
    const initSpecialChars = startingSpecialCharacterCount?.length ?? 0;
    updateHiddenInput(element, formattedNumber);

    // if user is typing, place the caret back in a good place
    if (type === "keyup") {
      const caretPos2Add = allFoundNumber - initSpecialChars;
      // doing this to push the char forward on initial character typing so that we can account for the pound being added

      // replace carrot if required
      setCaretPosition(element.id, startingCaretPosition + caretPos2Add);
    }
  } else {
    updateHiddenInput(element, "0");
    // if field is deleted by user, place it back to 0
    element.value = null;
  }
};

export default convertElementInputToCurrency;

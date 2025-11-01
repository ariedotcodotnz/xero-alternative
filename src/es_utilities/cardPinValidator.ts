export const validatePin = (enteredPin, confirmedPin) => {
  const onlyDigitsRegex = /^[0-9]*$/;
  const repeatingPinRegex = /(?:(\d)(\1){3})/;

  if (!onlyDigitsRegex.test(enteredPin))
    return "Error: PIN can only contain digits 0-9";
  if (enteredPin.length !== 4) return "Error: PIN must be 4 digits long";
  if (repeatingPinRegex.test(enteredPin) || "01234567890".includes(enteredPin))
    return "Error: PIN must not be sequential or repeating numbers";
  if (enteredPin !== confirmedPin)
    return "Error: PIN confirmation does not match";

  return null;
};

const clearPinFields = (cardPinInput, confirmCardPinInput) => {
  cardPinInput.value = "";
  confirmCardPinInput.value = "";
};

const cardPinValidator = () => {
  document.addEventListener("submit", (event) => {
    if (
      !(
        event.target instanceof HTMLFormElement &&
        event.target.id === "update-card-pin-form"
      )
    )
      return;

    const updatePinButton = document.querySelector(".update-pin-button");
    const cardPinInput = document.getElementById("card-pin");
    const confirmCardPinInput = document.getElementById("confirm-card-pin");

    if (
      !(updatePinButton instanceof HTMLInputElement) ||
      !(cardPinInput instanceof HTMLInputElement) ||
      !(confirmCardPinInput instanceof HTMLInputElement) ||
      updatePinButton.disabled
    )
      return;

    updatePinButton.disabled = true;

    const error = validatePin(cardPinInput.value, confirmCardPinInput.value);

    if (error !== null) {
      event.preventDefault();
      toastr.error(error);
      clearPinFields(cardPinInput, confirmCardPinInput);
      updatePinButton.removeAttribute("disabled");
    }
  });
};

export default cardPinValidator;

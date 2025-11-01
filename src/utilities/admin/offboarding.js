function handleOffBoardingReasonChange() {

  const offboardReason = document.getElementById("off-board-reason-input").value;
  const secondaryReasonWrapper = document.getElementById("secondary_reason_wrapper");
  const secondaryReasonSelect = document.getElementById("secondary_reason_select");
  const secondaryReasonInput = secondaryReasonWrapper.querySelector("input");

  const button = document.getElementById("off-board-submit-btn");

  if (offboardReason === "hnry_initiated") {
    button.setAttribute("disabled", "true");
    secondaryReasonWrapper.classList.remove("tw-hidden");
    if (secondaryReasonSelect.selectedIndex !== 0){
      button.removeAttribute("disabled");
    }
  } else {
    secondaryReasonWrapper.classList.add("tw-hidden");
    secondaryReasonSelect.selectedIndex = 0;
    secondaryReasonInput.value = "Please select";
    button.removeAttribute("disabled");
  }
}

document.addEventListener("click", event => {
  if (document.getElementById("offboarding-form")?.contains(event.target)){
    handleOffBoardingReasonChange()
  }
})
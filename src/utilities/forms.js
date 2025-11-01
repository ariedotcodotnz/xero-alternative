/**
 * Toggles the "required" attribute for an Array of input elements.
 * This is usually used when a toggle has been activated in response to a question
 * that now requires extra inputs to be make compulsory - or not compulsory - for
 * the user.
 *
 * @param {boolean} requiredness Whether the fields should be required or not
 * @param {string[]} selectors CSS selectors of form elements to toggle requiredness of
 */
const changeRequirednessForSelectors = function (requiredness, selectors) {
  selectors.forEach(function (selector) {
    const selectedElement = $(selector);
    if (requiredness) {
      selectedElement.prop("required", true);
    } else {
      selectedElement.removeProp("required");
      selectedElement.val(null);
    }
  });
};

/**
 * Disables the closest submit button if an input with the `validate-email` class
 * does not have one or more valid emails
 *
 * TODO: DELETE this. It is only used in app/views/tour/_template_email.html.erb
 *
 * @param {InputEvent} event - Event emitted from the input element
 */
const validateEmail = ({ target }) => {
  // Get the input that needs validation
  const inputNeedsValidation = target.classList.contains("validate-email");
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (inputNeedsValidation) {
    // If there is an input, test the value typed against the regex
    // and set the disabled-ness of the forms submit button accordingly
    const submitButton = target.form.querySelector("button[type='submit']");
    const inputValue = target.value;
    const emails = inputValue
      .split(/\;|\,/);
    const emailsAreValid = emails
      .map((email) => EMAIL_REGEX.test(email.trim()))
      .every((email) => email);

    submitButton.disabled = !emailsAreValid;
  }
};

// Detect change on Switch in Tour/Income Forecast
$(document).on("change", "#user_financial_attributes_paye", (event) => {
  changeRequirednessForSelectors(event.currentTarget.checked, [
    "[name='user\[financial_attributes\]\[annual_salary_start_date\]']",
  ]);
});

document.addEventListener("input", (event) => validateEmail(event));

/**
 * Trigger for option buttons. When a radio input (which is really what the option
 * buttons are) changes, the change event will bubble to the `document`. We
 * check if the change event came from a option button component, and then call
 * the function that handles that logic.
 */
document.addEventListener("change", (event) => {
  const { target } = event;
  if (target.matches(".option-buttons input[type='radio']")) {
    handleDuoButtonChange(target);
  }
});

/**
 * Runs when the user changes the selected value of a option button component.
 * If the option button has feedback associated with it, then this function
 * will show the correct feedback, hide the other ones, as well as clear their
 * inputs so that we don't accidentally send some inputs to the server.
 *
 * @param {HTMLElement} target - The input that has been selected
 */
const handleDuoButtonChange = (target) => {
  // Grab the feedbackId (identifies which feedbackElement the selected value controls)
  // and the text of the button for the selected option button, and find the relevant feedbackElement
  const { feedbackid, text } = target.dataset;
  const feedbackElement = document.querySelector(`#${feedbackid}-feedback`);
  // Some option buttons do no trigger feedback, so nothing more needs to be done in this case
  if (!feedbackElement) return;

  // Get all the feedbackElements for this option button component as well as the one to show
  const allFeedbacks = feedbackElement.querySelectorAll(".inner-feedback");
  const feedbackToShow = feedbackElement.querySelector(`[data-value='${text}']`);

  // For each feedbackElement
  allFeedbacks.forEach((element) => {
    // As long as it's not the one to show
    if (element && element !== feedbackToShow) {
      // Hide it
      const cls = ["hidden", "feedback__text"];
      element.classList.add(...cls);

      // Then reset any inputs as required
      const inputsToClear = element.querySelectorAll("input:not(.keep-input)");
      if (inputsToClear.length) {
        inputsToClear.forEach((input) => {
          if (input.matches("[type='checkbox']") || input.matches("[type='radio']")) {
            input.checked = false;
          } else if (input.classList.contains("select-dropdown")) {
            // For MDB select dropdowns: if the user navigates back, we want the default option to be selected again.
            const dropdown = document.querySelector("select.mdb-select");
            const defaultOption = dropdownDefaultOption(dropdown);
            input.value = defaultOption || "";
          } else {
            input.value = "";
          }
        });
      }
    } else {
      // Show the feedback that needs to be shown
      feedbackToShow.classList.remove("hidden");
    }
  });
};

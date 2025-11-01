/**
 * Add required to another input when a checkbox input is checked
 * Usage:
 * - Add data: { "input_ids": "<inputToAddRequiredId>,<inputToAddRequiredId>,..."} and add class="required-if-checked" to the
 *   checkbox input that control the required attribute on the another inputs (B)
 * - Add <span class="required-if"></span> inside the label of the inputs (B) and
 *   add "tw-hidden" if it is not required by default
 */

/**
 * Set required attribute of an input to true if another input is checked,
 * otherwise set to false. Also, shows an asterisk symbol on the input label
 * if it is required.
 * @param inputId
 * @param inputChecked
 */
const addRequiredToInput = (inputId: string, inputChecked: boolean) => {
  // eslint-disable-next-line xss/no-mixed-html
  const inputToAddRequired = document.getElementById(inputId) as HTMLInputElement;
  const inputLabel = document.querySelector(`label[for='${inputId}']`);
  const spanLabel = inputLabel?.querySelector(".required-if");

  if (inputToAddRequired && inputChecked) {
    inputToAddRequired.required = true;
    spanLabel?.classList.remove("tw-hidden");
  } else if (inputToAddRequired) {
    inputToAddRequired.required = false;
    spanLabel?.classList.add("tw-hidden");
  }
};

const addRequiredIfChecked = () => {
  document.addEventListener("change", (event: Event) => {
    const { target } = event;

    if (target instanceof HTMLInputElement) {
      if (target.matches(".required-if-checked")) {
        const { checked } = target;

        const targets = target.dataset?.inputIds?.split(",")
        if (targets !== undefined) {
          targets.forEach((inputId) => {
            addRequiredToInput(inputId, checked)
          })
        }
      }
    }
  });
}

export default addRequiredIfChecked;

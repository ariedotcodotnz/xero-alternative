import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "cancelCheckbox", "activeSubmitButton", "inactiveSubmitButton" ];

  cancelCard(event) {
    if (this.cancelCheckboxTarget.checked) {
      this.activeSubmitButtonTarget.classList.remove("hidden");
      this.inactiveSubmitButtonTarget.classList.add("hidden");
    } else {
      this.activeSubmitButtonTarget.classList.add("hidden");
      this.inactiveSubmitButtonTarget.classList.remove("hidden");
    }
  }
}

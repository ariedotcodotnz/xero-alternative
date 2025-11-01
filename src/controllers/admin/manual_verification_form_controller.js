import { Controller } from "@hotwired/stimulus";

class ManualVerificationFormController extends Controller {
  static targets = ["checkbox"];

  submit(event) {
    if (!this.checkboxTarget.checked) {
      event.preventDefault()
      event.stopImmediatePropagation()
        // eslint-disable-next-line no-alert
      alert("You must confirm all given details match the supplied document.")
    }
  }
}

export default ManualVerificationFormController;

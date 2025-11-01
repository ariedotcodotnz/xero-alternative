import { Controller } from "@hotwired/stimulus";

class FormController extends Controller {
  connect() {
    this.element.setAttribute("novalidate", true);
    this.element.addEventListener("blur", this.onBlur, true);
    document.addEventListener("fieldValueChange", this.handleValueChange);
  }

  disconnect() {
    this.element.removeEventListener("blur", this.onBlur);
    document.removeEventListener("fieldValueChange", this.handleValueChange);
  }

  onBlur = (event) => {
    let field = null;
    const { target } = event;

    // e.g. clear button on datepicker, typedown
    if (target.type === "button" && target.classList.contains("clear-input")) {
      field = target.parentElement.querySelector("input");
    }

    this.validateField(field || target);
  };

  onSubmit = (event) => {
    if (!this.validateForm()) {
      event.preventDefault();
      event.stopPropagation();
      this.firstInvalidField.focus();
    }
  };

  // Sometimes the value of input is updated manually without onchange event
  // need to trigger custom event to valid the form
  handleValueChange = (event) => {
    const { detail } = event;
    const { type } = detail;
    let input = null;

    if (typeof detail === "undefined" || detail.target == null) return;

    if (type === "file") {
      input = detail.target;
    } else if (type === "typedown" || type === "datepicker") {
      input = detail.target.querySelector("input");
    }
    this.validateField(input);

    const value = detail.value || input.value;
    if (input && value) { input.classList.remove("invalid", type); }
  };

  get formFields() {
    return Array.from(this.element.elements).filter((e) => !["reset", "submit", "button", "hidden"].includes(e.type));
  }

  get firstInvalidField() {
    return this.formFields.find((field) => !field.checkValidity());
  }

  validateForm() {
    let isValid = true;

    this.formFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;

        // manual append validation as the file-upload input is hidden
        if (field.type === "text" && field.classList.contains("file-upload")) {
          this.updateFieldErrorHtml(field, false);
        }
      }
    });

    return isValid;
  }

  validateField(field) {
    if (field === null || field.disabled || ["A"].includes(field.tagName)) return true;

    const valid = field.checkValidity();
    this.updateFieldErrorHtml(field, valid);

    return valid;
  }

  updateFieldErrorHtml(field, valid) {
    if (!valid) {
      this.showErrorForInvalidField(field);

      // mdb-select created another input which showing on UI so
      // need to manually add invalid class to the input
      if (field.type === "select-one") {
        const input = document.querySelector(".select-dropdown");
        input && input.classList.add("invalid");
      }
    } else {
      this.removeExistingErrorHtml(field);
    }
  }

  removeExistingErrorHtml(field) {
    const fieldWrapper = this.findFieldWrapper(field);
    if (!fieldWrapper) return;

    const existingErrorEl = fieldWrapper.querySelector(".validation-errors");
    if (existingErrorEl) {
      existingErrorEl.parentNode.removeChild(existingErrorEl);
    }
    field.classList.remove("invalid");
  }

  findFieldWrapper(field, type) {
    const fieldType = type || field.type;
    let wrapper = null;

    if (fieldType === "file") {
      wrapper = field.closest('div[data-react-class=\"inputs/file_upload/file_upload\"]');
    } else if (field.closest(".typedown") || fieldType === "typedown") {
      wrapper = field.closest(".typedown").parentElement;
    } else {
      wrapper = field.closest(".md-form");
    }
    return wrapper;
  }

  showErrorForInvalidField(field) {
    const fieldWrapper = this.findFieldWrapper(field);
    if (fieldWrapper === null) { return; }

    const label = fieldWrapper.querySelector("label");
    this.buildFieldErrorHtml(fieldWrapper, field, label);
    field.classList.add("invalid");
  }

  getValidationMessage(field, label) {
    const customMessage = field.getAttribute("data-custom-validation");
    let message = customMessage || field.validationMessage;

    if (customMessage === null && field.value === "" && label && label.innerText) {
      message = `${label.innerText} can't be blank`;
    }

    return message;
  }

  buildFieldErrorHtml(formWrapper, field, label) {
    // eslint-disable-next-line xss/no-mixed-html
    const errorHtml = formWrapper.querySelector(".validation-errors");
    const message = this.getValidationMessage(field, label);

    if (errorHtml !== null) {
      errorHtml.innerText = message;
    } else {
      const p = document.createElement("p");
      p.classList.add("validation-errors");
      p.innerText = message;
      formWrapper.appendChild(p);
    }
  }
}

export default FormController;

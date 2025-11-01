const toggleSubmitOnFormChange = (form) => {
  const submitButtons = form.querySelectorAll("button[type=submit]");
  submitButtons
    .forEach((submit) => {
      submit.removeAttribute("disabled");
    });
};

const toggleSubmitOnFormChangeListener = (e) => {
  toggleSubmitOnFormChange(e.currentTarget);
}

const disableFormSubmitUntilChange = () => {
  document.addEventListener("turbolinks:load", function () {
    document.querySelectorAll(".disable-submit-until-change").forEach((form) => {
      form.removeEventListener("input", toggleSubmitOnFormChangeListener);
      form.addEventListener("input", toggleSubmitOnFormChangeListener);
    });

    document.addEventListener("click", (event: Event) => {
      const { target } = event;

      if (target instanceof HTMLButtonElement) {
        const form = target.closest("form");

        if (target.matches(".hnry-switch") && form && form.classList.contains("disable-submit-until-change")) {
          toggleSubmitOnFormChange(form);
        }
      }
    });
  });
};

export default disableFormSubmitUntilChange;

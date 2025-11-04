const toggleSubmitOnFormValidity = (form) => {
  if (form) {
  const formIsValid = form.checkValidity();
  document
    .querySelectorAll(`[id="should-disable-${form.id}"], [class*="should-disable-${form.id}"]`)
    .forEach((submit) => {
      if (formIsValid) {
        submit.removeAttribute("disabled");
      } else {
        submit.setAttribute("disabled", "disabled");
      }
    });
  }
};


const toggleSubmitOnFormValidityListener = (e) =>
  toggleSubmitOnFormValidity(e.currentTarget);

const addInputListener = (form) => {
  form.removeEventListener("change", toggleSubmitOnFormValidityListener);
  form.addEventListener("change", toggleSubmitOnFormValidityListener);
  toggleSubmitOnFormValidity(form);
};

/*
 * MutationObserver is used to detect changes in the form
 * This is necessary because the form may be changed by JavaScript
 * e.g. when a React component is mounted inside the form
 */
const addMutationObserver = (form) => {
  const formObserver = new MutationObserver((e) => {
    if (!(e[0].target instanceof HTMLElement)) return;
    const observedForm = e[0].target.closest("form");
    toggleSubmitOnFormValidity(observedForm);
  });

  formObserver.observe(form, { childList: true, subtree: true });

  document.addEventListener("turbolinks:before-visit", () => {
    formObserver.disconnect();
  });
};

const disableFormSubmitUntilValid = () => {
  document.querySelectorAll(".disable-submit-until-valid").forEach((form) => {
    addMutationObserver(form);
    addInputListener(form);
  });
};

export default disableFormSubmitUntilValid;
export { toggleSubmitOnFormValidity };

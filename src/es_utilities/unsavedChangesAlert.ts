import I18n from "../utilities/translations";

const monitoredFormClass = "alert-unsaved-changes";

const unsavedChangesAlert = () => {
  let unsavedChanges = false;

  document.addEventListener("input", (e) => {
    const { target } = e;
    if (
      target instanceof HTMLElement &&
      target.closest(`.${monitoredFormClass}`) !== null
    ) {
      unsavedChanges = true;
    }
  });

  document.addEventListener("click", (e) => {
    const { target } = e;
    if (
      target instanceof HTMLElement &&
      target.classList.contains("hnry-switch") &&
      target.closest(`.${monitoredFormClass}`) !== null
    ) {
      unsavedChanges = true;
    }
  });

  document.addEventListener("submit", (e) => {
    const { target } = e;

    if (
      target instanceof HTMLFormElement &&
      target.classList.contains(monitoredFormClass)
    ) {
      unsavedChanges = false;
    }
  });

  // Confirm before navigating to an external page
  window.addEventListener("beforeunload", (e) => {
    if (unsavedChanges) {
      e.preventDefault();
      return I18n.t("global.unsaved_changes_warning");
    }
    return true;
  });

  // manually trigger to cancel unsaved_changes alert
  window.addEventListener("hnry:cancel_unsaved_changes", (e) => {
    e.preventDefault();
    unsavedChanges = false;
  });

  // Confirm before navigating to another page within the app
  document.addEventListener("turbolinks:before-visit", (e) => {
    if (unsavedChanges) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!window.confirm(I18n.t("global.unsaved_changes_warning"))) {
        e.preventDefault();
        return;
      }
      unsavedChanges = false;
    }
  });
};

export default unsavedChangesAlert;

import { attachCopyContentListeners } from "./copy";
import addRequiredIfChecked from "./addRequiredIfChecked";
import bindClickableRows, { processClickableRows } from "./clickableRows";
import bindToastFlashMessages, { toastFlashMessages } from "./flash";
import cardPinValidator from "./cardPinValidator.js";
import disableFormSubmitUntilChange from "./disabledFormSubmitUntilChange.js";
import disableFormSubmitUntilValid from "./disableFormSubmitUntilValid.js";
import dismissNotification from "./dismissNotification.js";
import loggedOutAnalyticsHelper from "./loggedOutAnalyticsHelper.js";
import unsavedChangesAlert from "./unsavedChangesAlert.js";

/**
 * Calling a bunch of legacy functions that are expected to be called on page load
 * They mostly attach event listeners to the document for delegated events
 */
addRequiredIfChecked();
attachCopyContentListeners();
bindClickableRows();
bindToastFlashMessages();
cardPinValidator();
dismissNotification();
loggedOutAnalyticsHelper();
unsavedChangesAlert();
disableFormSubmitUntilChange();

// These functions are exposed to the global window object so they can be called from js.erb files
// Yes I'm sad too.
window.initializeFormDisabledButtons = disableFormSubmitUntilValid;
window.processClickableRows = processClickableRows;
window.toastFlashMessages = toastFlashMessages;

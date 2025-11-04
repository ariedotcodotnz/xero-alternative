import { attachCopyContentListeners } from "./copy";
import addRequiredIfChecked from "./addRequiredIfChecked";
import bindClickableRows, { processClickableRows } from "./clickableRows";
import bindToastFlashMessages, { toastFlashMessages } from "./flash";
import cardPinValidator from "./cardPinValidator";
import disableFormSubmitUntilChange from "./disabledFormSubmitUntilChange";
import disableFormSubmitUntilValid, { toggleSubmitOnFormValidity } from "./disableFormSubmitUntilValid";
import dismissNotification from "./dismissNotification";
import loggedOutAnalyticsHelper from "./loggedOutAnalyticsHelper";
import unsavedChangesAlert from "./unsavedChangesAlert";

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
// @ts-ignore
window.initializeFormDisabledButtons = disableFormSubmitUntilValid;
// @ts-ignore
window.flipSubmit = toggleSubmitOnFormValidity;
// @ts-ignore
window.processClickableRows = processClickableRows;
// @ts-ignore
window.toastFlashMessages = toastFlashMessages;

// Provide safe fallbacks for globals expected by legacy code
if (typeof window !== "undefined") {
  // Used by turbolinks_transitions.js and dialog.js
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.initializeComponents = window.initializeComponents || function () {};
  // Some modules call Materialize.updateTextFields() directly
  window.Materialize = window.Materialize || {};
  if (typeof window.Materialize.updateTextFields !== "function") {
    window.Materialize.updateTextFields = function () {};
  }
}

require("./admin/expense_categories");
require("./admin/onboarding");
require("./admin/notes");
require("./admin/sales_tax_filing");
require("./sharesheet");
require("./show_element");
require("./set_country_cookie");
require("./Toastr");
require("./turbolinks_transitions");
require("./custom_scrollbars");
require("./allocation_preferences");
require("./forms");
require("./ellipsis_menus");
require("./invoices");
require("./dialog");
require("./income_estimates");
require("./onboarding_tour");
require("./checkbox_enabler");
require("what-input");
require("./profile");
require("./request_submit_polyfill");

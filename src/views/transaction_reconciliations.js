import ReactRailsUJS from "react_ujs";
import { subscribe } from "../admin_channels/payor_declared_income_channel";

// Simple class to allow the different checkboxes to behave like a radio button group.
// When adding more checkboxes, just add it to `this.data` with a meaningful key
// and call new `CheckboxesDisguisedAsRadioButtons($(this)).check(<your new key>)` to toggle.
class CheckboxesDisguisedAsRadioButtons {
  constructor(parent) {
    const wrapper = parent.closest(".new_transaction_reconciliation");

    this.data = {
      partial: wrapper.find("input[name='transaction_reconciliation[is_partial_payment]'][type='checkbox']"),
      multi: wrapper.find("input[name='transaction_reconciliation[is_multi_payment]'][type='checkbox']"),
      card: wrapper.find("input[name='transaction_reconciliation[manual_card_reconciliation]'][type='checkbox']"),
    };
    this.keys = Object.keys(this.data);
  }

  check(key) {
    if (!(this.keys.includes(key))) { throw new Error("not a valid key"); }
    const checkbox = this.data[key];

    this.keys.forEach((loopedKey) => {
      if (key != loopedKey) {
        const loopedCheckbox = this.data[loopedKey];
        if (loopedCheckbox.prop("checked") && checkbox.prop("checked")) {
          loopedCheckbox.prop("checked", false).change();
        }
      }
    });
  }
}

const onChangeOfClient = () => {
  $(document).on("change", '.new_transaction_reconciliation select[name="transaction_reconciliation[client_id]"]', function (event) {
    event.preventDefault();
    const $form = $(this).closest(".new_transaction_reconciliation");
    const formData = getFormData($form);

    const clientId = $(this).children("option:selected").val();

    if (clientId == "") {
      return;
    }

    $.rails.ajax({
      type: "GET",
      url: Routes.admin_transaction_reconciliation_preview_path(formData),
      success: refreshForm,
    });
    return false;
  });
};

const onChangeOfInvoice = () => {
  $(document).on("change", '.new_transaction_reconciliation select[name="transaction_reconciliation[invoice_id]"]', function (event) {
    event.preventDefault();
    const bankTransactionId = $(this).closest(".new_transaction_reconciliation").find('input[name="transaction_reconciliation[bank_transaction_id]"]').val();
    const invoiceId = $(this).children("option:selected").val();
    const $form = $(this).closest(".new_transaction_reconciliation");
    const jurisdictionCode = getFormData($form).jurisdiction;

    if (invoiceId == "") {
      return;
    }

    const $partialPaymentCheckbox = $(this).closest(".new_transaction_reconciliation").find("input[name='transaction_reconciliation[is_partial_payment]'][type='checkbox']");
    const isPartialPayment = $partialPaymentCheckbox.prop("checked");
    $.rails.ajax({
      type: "GET",
      url: Routes.admin_transaction_reconciliation_preview_path({
        transaction_reconciliation: {
          invoice_id: invoiceId,
          bank_transaction_id: bankTransactionId,
          is_partial_payment: isPartialPayment,
        },
        jurisdiction: jurisdictionCode,
      }),
      success: refreshForm,
    });

    return false;
  });
};

const onMultiInvoiceSelect = () => {
  $(document).on("change", ".multi-reconciliation-invoice", function (event) {
    event.preventDefault();

    const clientId = $(this).data("clientId");
    const $clientField = $(this).closest(".new_transaction_reconciliation").find("select[name='transaction_reconciliation[client_id]']").find(`option[value="${clientId}"]`);
    $clientField.prop("selected", true).change();
    return false;
  });
};

const setRequiredToDropdown = (dropdown, required) => {
  if (dropdown) {
    const inputs = Array.from(dropdown.querySelectorAll(["input", "select"]) || []);

    inputs.forEach((el) => {
      if (el) { el.required = required; }
    });
  }
};

const onMultiInvoiceReconciliationChecked = () => {
  $(document).on("change", ".new_transaction_reconciliation input[name='transaction_reconciliation[is_multi_payment]']", function (event) {
    event.preventDefault();

    new CheckboxesDisguisedAsRadioButtons($(this)).check("multi");
    const $singleInvoice = $(this).closest(".new_transaction_reconciliation").find(".single-invoice");
    const $singleInvoiceInput = $singleInvoice.find("input");
    const $multiInvoices = $("[name='transaction_reconciliation\[invoice_ids\]\[\]']");

    // The `transaction-id` now lives on the form instead of on the multi invoice drop down.
    // It has to be more "general" for use, as the manual hnry card checkbox event uses it too.
    const transactionId = $(this).closest("form").data("transaction-id");
    const clientsDropdown = document.getElementById(`${transactionId}_clients_dropdown`);

    if ($(this).prop("checked")) {
      $singleInvoiceInput.val("");
      $singleInvoice.hide();
      setRequiredToDropdown(clientsDropdown, false);
    } else {
      setRequiredToDropdown(clientsDropdown, true);
      $singleInvoice.show();
      $multiInvoices.each((_, checkbox) => $(checkbox).prop("checked", false));
      const runningTotal = $multiInvoices.parents(`[id$='${transactionId}_multi_reconciliation']`).find("#invoices_total")[0];
      runningTotal.dataset.runningTotal = 0;
      $(runningTotal).text("Total: $0.00");
    }

    return false;
  });
};

const calculateTotal = () => {
  $(document).on("change", "[name='transaction_reconciliation\[invoice_ids\]\[\]']", function (event) {
    event.preventDefault();

    const runningTotal = $(event.target).parents("[id$='multi_reconciliation']").find("#invoices_total")[0];

    const total = +runningTotal.dataset.runningTotal;
    if (event.target.checked) {
      runningTotal.dataset.runningTotal = total + +event.target.dataset.total;
    }
    if (!event.target.checked) {
      runningTotal.dataset.runningTotal = total - +event.target.dataset.total;
    }

    $(runningTotal).text(`Total: $${(+runningTotal.dataset.runningTotal).toFixed(2)}`);
  });
};

const onPartialPaymentChecked = () => {
  $(document).on("change", '.new_transaction_reconciliation input[name="transaction_reconciliation[is_partial_payment]"]', function (event) {
    event.preventDefault();
    new CheckboxesDisguisedAsRadioButtons($(this)).check("partial");
    return false;
  });
};

const onManualHnryCardSubmit = () => {
  $(document).on("click", "#manual-hnry-card-reconciliation-submit", function (event) {
    event.preventDefault();
    const $form = $(this).closest("form");

    $form.find("input[type='submit']").prop("disabled", true);

    const $manualCardReconciliation = $form.find("input[name='transaction_reconciliation[manual_card_reconciliation]'][type='hidden']");
    $manualCardReconciliation.val("1");

    $form.submit();
  });
};

const refreshForm = (data) => {
  const newForm = $(data);
  const oldForm = $(`#${newForm.attr("id")}`);
  const parent = oldForm.parentElement;
  oldForm.replaceWith(newForm);
  ReactRailsUJS.mountComponents(parent);
};

const getFormData = ($form) => {
  const unindexed_array = $form.serializeArray();
  const indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    // Filter out form items with _typedown which are for presentation only via the typedown
    if (n.name.indexOf("_typedown") < 0) {
      indexed_array[n.name] = n.value;
    }
  });

  return indexed_array;
};

$(document).ready(function () {
  onChangeOfClient();
  onChangeOfInvoice();
  onMultiInvoiceSelect();
  onPartialPaymentChecked();
  onMultiInvoiceReconciliationChecked();
  calculateTotal();
  onManualHnryCardSubmit();

  $(".payor-declared-income-info").each((index, infoBox) => {
    subscribe($(infoBox).data("userId"), (data) => {
      // eslint-disable-next-line xss/no-mixed-html
      $(infoBox).html($(data.html).html());
    });
  });
});
